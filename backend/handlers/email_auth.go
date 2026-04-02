package handlers

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"math/big"
	"net/http"
	"os"
	"time"

	"visionary-backend/models"
	"visionary-backend/utils"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

func generateEmailOTP() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

func sendBrevoOTPEmail(toEmail, toName, otp string) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	senderEmail := os.Getenv("BREVO_SENDER_EMAIL")
	senderName := os.Getenv("BREVO_SENDER_NAME")

	payload := map[string]interface{}{
		"sender": map[string]string{
			"email": senderEmail,
			"name":  senderName,
		},
		"to": []map[string]string{
			{"email": toEmail, "name": toName},
		},
		"subject": "Your Visionary verification code",
		"htmlContent": fmt.Sprintf(`
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
  <h2 style="color:#1a1a1a">Verify your email</h2>
  <p style="color:#555">Use the code below to complete your signup. It expires in <strong>10 minutes</strong>.</p>
  <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:20px;background:#f4f4f4;border-radius:8px;text-align:center;color:#1a1a1a">%s</div>
  <p style="color:#999;font-size:12px;margin-top:24px">If you did not request this, please ignore this email.</p>
</body>
</html>`, otp),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("api-key", apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("brevo API status %d: %s", resp.StatusCode, string(respBody))
	}
	return nil
}

func issueJWT(userID string, email, name, picture string) (string, error) {
	claims := jwt.MapClaims{
		"sub":     userID,
		"email":   email,
		"name":    name,
		"picture": picture,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// Signup registers a new user with email/password and sends an OTP for email verification.
func Signup(w http.ResponseWriter, r *http.Request) {
	var req models.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Password == "" {
		http.Error(w, "email and password are required", http.StatusBadRequest)
		return
	}
	if len(req.Password) < 8 {
		http.Error(w, "password must be at least 8 characters", http.StatusBadRequest)
		return
	}

	// Check if a verified account already exists for this email
	var existingID string
	var emailVerified bool
	err := utils.DB.QueryRow(context.Background(),
		`SELECT id, COALESCE(email_verified, false) FROM users WHERE email = $1 AND password_hash IS NOT NULL LIMIT 1`,
		req.Email,
	).Scan(&existingID, &emailVerified)

	alreadyExists := !errors.Is(err, pgx.ErrNoRows) && err == nil
	if alreadyExists && emailVerified {
		http.Error(w, "email already registered", http.StatusConflict)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	otp, err := generateEmailOTP()
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	otpExpiry := time.Now().Add(10 * time.Minute)

	var userID string
	if alreadyExists {
		// Refresh password + OTP for unverified user
		_, err = utils.DB.Exec(context.Background(),
			`UPDATE users SET password_hash=$1, name=$2, email_otp=$3, email_otp_expires_at=$4, updated_at=NOW() WHERE id=$5`,
			string(hash), req.Name, otp, otpExpiry, existingID,
		)
		if err != nil {
			http.Error(w, "failed to update user: "+err.Error(), http.StatusInternalServerError)
			return
		}
		userID = existingID
	} else {
		err = utils.DB.QueryRow(context.Background(),
			`INSERT INTO users (email, name, password_hash, email_otp, email_otp_expires_at, email_verified)
			 VALUES ($1, $2, $3, $4, $5, false)
			 RETURNING id`,
			req.Email, req.Name, string(hash), otp, otpExpiry,
		).Scan(&userID)
		if err != nil {
			http.Error(w, "failed to create user: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if err := sendBrevoOTPEmail(req.Email, req.Name, otp); err != nil {
		// TODO: remove this log once Brevo account is activated
		log.Printf("[DEV] OTP for %s: %s (email sending failed: %v)", req.Email, otp, err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Verification OTP sent to your email. Please verify to complete signup.",
		"user_id": userID,
	})
}

// VerifyEmailOTP confirms the OTP and issues a JWT on success.
func VerifyEmailOTP(w http.ResponseWriter, r *http.Request) {
	var req models.VerifyEmailOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.OTP == "" {
		http.Error(w, "email and otp are required", http.StatusBadRequest)
		return
	}

	user := &models.User{}
	var storedOTP string
	var otpExpiry time.Time
	err := utils.DB.QueryRow(context.Background(),
		`SELECT id, COALESCE(email,''), COALESCE(name,''), COALESCE(picture,''),
		        COALESCE(email_otp,''), COALESCE(email_otp_expires_at, NOW()-interval '1 second'), created_at
		 FROM users WHERE email = $1 AND password_hash IS NOT NULL LIMIT 1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Picture, &storedOTP, &otpExpiry, &user.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if storedOTP == "" {
		http.Error(w, "no pending OTP for this email", http.StatusBadRequest)
		return
	}
	if storedOTP != req.OTP {
		http.Error(w, "invalid OTP", http.StatusUnauthorized)
		return
	}
	if time.Now().After(otpExpiry) {
		http.Error(w, "OTP expired", http.StatusUnauthorized)
		return
	}

	_, err = utils.DB.Exec(context.Background(),
		`UPDATE users SET email_verified=true, email_otp=NULL, email_otp_expires_at=NULL, updated_at=NOW() WHERE id=$1`,
		user.ID,
	)
	if err != nil {
		http.Error(w, "failed to verify email: "+err.Error(), http.StatusInternalServerError)
		return
	}

	signed, err := issueJWT(user.ID, user.Email, user.Name, user.Picture)
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Email verified successfully.",
		"token":   signed,
		"user":    user,
	})
}

// Signin authenticates a user with email/password and returns a JWT.
func Signin(w http.ResponseWriter, r *http.Request) {
	var req models.SigninRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Password == "" {
		http.Error(w, "email and password are required", http.StatusBadRequest)
		return
	}

	user := &models.User{}
	var passwordHash string
	var emailVerified bool
	err := utils.DB.QueryRow(context.Background(),
		`SELECT id, COALESCE(email,''), COALESCE(name,''), COALESCE(picture,''),
		        COALESCE(password_hash,''), COALESCE(email_verified, false), created_at
		 FROM users WHERE email = $1 AND password_hash IS NOT NULL LIMIT 1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Picture, &passwordHash, &emailVerified, &user.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) || passwordHash == "" {
		http.Error(w, "invalid email or password", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if !emailVerified {
		http.Error(w, "email not verified. Please check your inbox for the OTP.", http.StatusForbidden)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		http.Error(w, "invalid email or password", http.StatusUnauthorized)
		return
	}

	signed, err := issueJWT(user.ID, user.Email, user.Name, user.Picture)
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": signed,
		"user":  user,
	})
}

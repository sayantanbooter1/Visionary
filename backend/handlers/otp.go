package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"visionary-backend/models"
	"visionary-backend/utils"

	"github.com/golang-jwt/jwt/v5"
	twilioClient "github.com/twilio/twilio-go"
	twilioVerify "github.com/twilio/twilio-go/rest/verify/v2"
)

func getTwilioClient() *twilioClient.RestClient {
	return twilioClient.NewRestClientWithParams(twilioClient.ClientParams{
		Username: os.Getenv("TWILIO_ACCOUNT_SID"),
		Password: os.Getenv("TWILIO_AUTH_TOKEN"),
	})
}

// SendOTP sends a one-time passcode to the given phone number via SMS.
// Body: { "phone": "+91XXXXXXXXXX" }
func SendOTP(w http.ResponseWriter, r *http.Request) {
	var body models.SendOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Phone == "" {
		http.Error(w, "phone is required", http.StatusBadRequest)
		return
	}

	params := &twilioVerify.CreateVerificationParams{}
	params.SetTo(body.Phone)
	params.SetChannel("sms")

	_, err := getTwilioClient().VerifyV2.CreateVerification(os.Getenv("TWILIO_VERIFY_SERVICE_SID"), params)
	if err != nil {
		http.Error(w, "failed to send OTP: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "OTP sent successfully"})
}

// VerifyOTP checks the OTP, upserts the user, and returns a JWT.
// Body: { "phone": "+91XXXXXXXXXX", "code": "123456" }
func VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var body models.VerifyOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Phone == "" || body.Code == "" {
		http.Error(w, "phone and code are required", http.StatusBadRequest)
		return
	}

	// Check OTP with Twilio Verify
	params := &twilioVerify.CreateVerificationCheckParams{}
	params.SetTo(body.Phone)
	params.SetCode(body.Code)

	result, err := getTwilioClient().VerifyV2.CreateVerificationCheck(os.Getenv("TWILIO_VERIFY_SERVICE_SID"), params)
	if err != nil {
		http.Error(w, "failed to verify OTP: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if result.Status == nil || *result.Status != "approved" {
		http.Error(w, "invalid or expired OTP", http.StatusUnauthorized)
		return
	}

	// Upsert user — same flow for signup and signin
	user := &models.User{}
	err = utils.DB.QueryRow(context.Background(), `
		INSERT INTO users (phone)
		VALUES ($1)
		ON CONFLICT (phone) DO UPDATE SET updated_at = NOW()
		RETURNING id, phone, COALESCE(name, ''), COALESCE(email, ''), created_at
	`, body.Phone).Scan(&user.ID, &user.Phone, &user.Name, &user.Email, &user.CreatedAt)
	if err != nil {
		http.Error(w, "failed to save user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Issue JWT
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"phone": user.Phone,
		"exp":   time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := jwtToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		http.Error(w, "failed to generate token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": signed,
		"user":  user,
	})
}

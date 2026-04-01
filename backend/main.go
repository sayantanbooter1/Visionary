package main

import (
	"log"
	"net/http"
	"time"

	apphandlers "visionary-backend/handlers"
	"visionary-backend/utils"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	utils.ConnectDB()

	r := mux.NewRouter()

	// Google OAuth routes
	r.HandleFunc("/api/auth/google", apphandlers.GoogleLogin).Methods("GET")
	r.HandleFunc("/api/auth/google/callback", apphandlers.GoogleCallback).Methods("GET")

	// Phone OTP routes (signup + signin)
	r.HandleFunc("/api/auth/send-otp", apphandlers.SendOTP).Methods("POST")
	r.HandleFunc("/api/auth/verify-otp", apphandlers.VerifyOTP).Methods("POST")

	// Email + password routes
	r.HandleFunc("/api/auth/signup", apphandlers.Signup).Methods("POST")
	r.HandleFunc("/api/auth/signin", apphandlers.Signin).Methods("POST")
	r.HandleFunc("/api/auth/verify-email", apphandlers.VerifyEmailOTP).Methods("POST")

	// CORS setup
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK Status"))

		w.Write([]byte(time.Now().Format(time.RFC3339)))
	}).Methods("GET")

	log.Println("🚀 Server running on http://localhost:8080")

	http.ListenAndServe(":8080", cors(r))
}

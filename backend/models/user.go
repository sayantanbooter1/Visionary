package models

import "time"

type User struct {
	ID        string       `json:"id"`
	GoogleID  string    `json:"google_id,omitempty"`
	Phone     string    `json:"phone,omitempty"`
	Email     string    `json:"email,omitempty"`
	Name      string    `json:"name,omitempty"`
	Picture   string    `json:"picture,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type SendOTPRequest struct {
	Phone string `json:"phone"`
}

type VerifyOTPRequest struct {
	Phone string `json:"phone"`
	Code  string `json:"code"`
}

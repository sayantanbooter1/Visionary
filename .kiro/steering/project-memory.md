# Visionary — Project Memory

## What is Visionary?
An educational platform (MVP) for students, teachers, and organizations. Users sign up, go through onboarding to select their role, and land on a dashboard.

---

## Tech Stack

### Frontend
- Next.js 16.1.7 (App Router, Turbopack), React 19, TypeScript 5.9
- Tailwind CSS 4.2, shadcn/ui (55 components in `components/ui/`)
- Zustand 5 (state management — no Context API)
- React Hook Form 7 + Zod 4 (form validation)
- Sonner (toasts), Lucide React (icons)
- react-phone-number-input (international phone input)
- Axios + native fetch for API calls

### Backend
- Go 1.26, Gorilla Mux (routing), Gorilla Handlers (CORS)
- PostgreSQL via Supabase (pgx/v5 connection pool)
- JWT (golang-jwt/jwt v5, 7-day expiry, HS256)
- Twilio Verify (OTP via SMS)
- Google OAuth 2.0 (golang.org/x/oauth2)

---

## Project Structure

```
/
├── frontend/                   # Next.js app
│   ├── app/                    # App Router pages (thin wrappers)
│   │   ├── page.tsx            # Home → redirects to /signup
│   │   ├── signup/page.tsx
│   │   ├── signin/page.tsx
│   │   ├── verify-otp/page.tsx
│   │   ├── on-boarding/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Header + Sidebar layout
│   │   │   └── page.tsx
│   │   └── auth/callback/page.tsx  # OAuth callback handler
│   ├── features/               # Feature components (actual UI logic)
│   │   ├── auth/
│   │   │   ├── signup/         # Email/mobile/OAuth signup
│   │   │   ├── signin/         # Email/OAuth signin
│   │   │   ├── mobile-signup/  # Phone + OTP flow
│   │   │   ├── onboarding/     # Category + role-specific forms
│   │   │   └── forgot-password/
│   │   ├── dashboard/          # Header, Sidebar, dashboard content
│   │   └── home/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── FloatingLabelInput.tsx  # Material-style floating label input
│   │   ├── Phone-input.tsx     # Country selector + phone input
│   │   └── theme-provider.tsx
│   ├── stores/
│   │   ├── appStore.ts         # Global user/auth/theme state
│   │   └── signupStore.ts      # Signup form state (persists across steps)
│   ├── services/
│   │   └── authService.ts      # API calls + sessionStorage helpers
│   ├── hooks/
│   │   ├── useAuth.ts          # Thin wrapper over appStore
│   │   └── use-mobile.ts
│   └── lib/utils.ts            # cn() utility
└── backend/
    ├── main.go                 # Server entry, routes, CORS
    ├── handlers/
    │   ├── auth.go             # Google OAuth handlers
    │   └── otp.go              # Twilio OTP send/verify
    ├── models/user.go          # User, SendOTPRequest, VerifyOTPRequest
    └── utils/db.go             # pgxpool connection
```

---

## API Endpoints (backend runs on :8080)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/google` | Redirect to Google OAuth consent |
| GET | `/api/auth/google/callback` | Exchange code → JWT + user |
| POST | `/api/auth/send-otp` | Send SMS OTP via Twilio |
| POST | `/api/auth/verify-otp` | Verify OTP → JWT + user |
| GET | `/health` | Health check |

Frontend uses `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`).

---

## Auth Flows

### Google OAuth
1. Frontend → `GET /api/auth/google` (redirect)
2. Google → `GET /api/auth/google/callback?code=...`
3. Backend exchanges code, upserts user, issues JWT
4. Redirects to `/auth/callback?token=...&user=...`
5. Frontend stores in `sessionStorage`, redirects to `/on-boarding`

### Phone OTP
1. User enters phone → `POST /api/auth/send-otp`
2. Twilio sends SMS
3. User enters 6-digit code → `POST /api/auth/verify-otp`
4. Backend verifies with Twilio, upserts user, returns JWT
5. Frontend stores in `sessionStorage`, redirects to `/on-boarding`

### Email/Password
- Client-side validation only (Zod schema)
- Stored in `signupStore` — backend integration pending

---

## Data Models

### User (PostgreSQL + Go)
```go
type User struct {
  ID        int
  GoogleID  string    // unique, for OAuth users
  Phone     string    // unique, for OTP users
  Email     string
  Name      string
  Picture   string
  CreatedAt time.Time
}
```
DB uses `INSERT ... ON CONFLICT DO UPDATE` (upsert pattern).

### signupStore (Zustand)
```typescript
{
  email, password, confirmPassword, phoneNumber,
  category: "student" | "teacher" | "organization" | null,
  fullName, selectGrade,
  selectBoard: "CBSE" | "ICSE" | "OTHER" | null
}
```

### appStore (Zustand)
```typescript
{
  user: { id, email, name, isAuthenticated },
  theme: "light" | "dark",
  loading: boolean,
  error: string | null
}
```

---

## Design System

### Colors
- Primary: `#2563EB` (blue-600), hover `#1D4ED8` (blue-700)
- Selected state: `bg-blue-100 text-blue-600`
- Borders: `#8E8E93` (disabled/neutral), `#D1D5DB` (gray-300)
- Text: `#111827` (gray-900), `#6B7280` (gray-500/600)

### Layout Tokens
- Card border-radius: `42px`
- Button border-radius: `50px` (desktop), `24px` (mobile)
- Card padding (desktop): `pt-[72px] pr-[42px] pb-[48px] pl-[42px]`
- Auth card max-width: `988px`
- Onboarding card: `800px`
- Dashboard content: `1024px`

### Typography
- Font: Geist (sans) + Geist Mono — loaded via `next/font/google`
- Heading: 36px, font-medium, line-height 130%, letter-spacing -0.5%
- Body: 16px (text-base)

### Responsive Breakpoints
- Mobile: `< md` (< 768px)
- Tablet: `md` to `lg`
- Desktop: `>= lg` (>= 1024px)
- Pages have 3 layout variants (desktop grid, tablet centered, mobile stacked)

---

## Key Patterns & Conventions

- All feature components are `"use client"` — no RSC in features/
- `app/` pages are thin wrappers that import from `features/`
- Feature `index.tsx` files (not `page.tsx`) to avoid routing conflicts
- Auth token + user stored in `sessionStorage` (not localStorage)
- `authenticatedFetch()` in `authService.ts` auto-attaches Bearer token
- `useAuth()` hook wraps `appStore` for component use
- Forms use React Hook Form + Zod; `FloatingLabelInput` for styled inputs
- Back buttons: `w-16 h-16 rounded-[42px] border border-[#8E8E93]`
- Toasts via Sonner, positioned `top-center`, dark slate theme

---

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (`.env`)
```
DB_URL=                    # PostgreSQL connection string (Supabase)
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=http://localhost:8080/api/auth/google/callback  # must point to backend
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
```

---

## Running the Project

```bash
# Frontend
cd frontend && npm run dev        # http://localhost:3000

# Backend
cd backend && go run main.go      # http://localhost:8080
```

---

## Known Gaps / TODO
- Email/password signup has no backend endpoint yet
- Microsoft OAuth button exists in UI but is not wired up
- No protected route guards (dashboard is publicly accessible)
- CORS is open (`*`) — needs restriction before production
- No refresh token logic; JWT expires after 7 days
- No global error boundary on frontend

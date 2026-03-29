"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FloatingLabelInput } from "@/components/FloatingLabelInput"
import Link from "next/link"

interface LoginWithEmailProps {
  onBack: () => void
}

export default function LoginWithEmail({ onBack }: LoginWithEmailProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [email, setEmailValue] = useState("")
  const [password, setPasswordValue] = useState("")

  // Error state
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return "Password is required"
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    // If no errors, proceed
    if (!emailErr && !passwordErr) {
      console.log("Login form submitted with data:", { email, password })
      // Simulate login - redirect to dashboard
      router.push("/dashboard")
    }
  }

  const isFormValid = email.length > 0 && password.length > 0

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col justify-between min-h-[500px] w-full max-w-[1008px]">
          {/* Back Button - Aligned with card's left edge */}
          <button
            onClick={onBack}
            className="w-16 h-16 rounded-[42px] border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition mb-6"
          >
            <ArrowLeft className="w-8 h-8 text-gray-600" />
          </button>

          {/* Main Card - Responsive */}
          <div 
            className="bg-white w-full rounded-[42px] border border-black border-opacity-30"
          >
            {/* Desktop Layout */}
            <div 
              className="hidden lg:block pt-[72px] pr-[42px] pb-[48px] pl-[42px]"
            >
              <div className="grid grid-cols-2 items-center h-full gap-[64px]">
                {/* Left Section */}
                <div className="flex flex-col justify-center">
                  <img src="/logo.png" alt="Logo" className="w-[79.74px] h-[58.57px] mb-8" />
                  <h1 className="text-gray-900 font-medium text-4xl leading-[130%] tracking-[-0.5%] mb-6">
                    Login to Your<br />Visionary Account
                  </h1>
                  {/* Forgot Password Link */}
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Forgot Password?
                  </Link>
                </div>

                {/* Right Section */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Email Input */}
                  <div className="flex flex-col gap-1">
                    <FloatingLabelInput
                      label="Enter Your Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmailValue(e.target.value)}
                      error={!!emailError}
                    />
                    {emailError && (
                      <span className="text-sm text-red-500">{emailError}</span>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1">
                    <FloatingLabelInput
                      label="Enter Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      showToggle={true}
                      isPasswordVisible={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      error={!!passwordError}
                    />
                    {passwordError && (
                      <span className="text-sm text-red-500">{passwordError}</span>
                    )}
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className={`w-full text-base font-medium h-12 rounded-[50px] transition-colors border-2 ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-[#8E8E93] border-[#8E8E93]'
                    }`}
                  >
                    Login
                  </Button>
                </form>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-6 sm:p-8">
              <div className="flex flex-col items-center text-center space-y-8">
                
                {/* Logo */}
                <div>
                  <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-gray-900 font-medium text-2xl sm:text-3xl leading-[130%] tracking-[-0.5%]">
                  Login to Your Visionary Account
                </h1>

                {/* Forgot Password Link */}
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Forgot Password?
                </Link>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  {/* Email Input */}
                  <div className="flex flex-col gap-1">
                    <FloatingLabelInput
                      label="Enter Your Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmailValue(e.target.value)}
                      error={!!emailError}
                    />
                    {emailError && (
                      <span className="text-sm text-red-500">{emailError}</span>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1">
                    <FloatingLabelInput
                      label="Enter Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      showToggle={true}
                      isPasswordVisible={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      error={!!passwordError}
                    />
                    {passwordError && (
                      <span className="text-sm text-red-500">{passwordError}</span>
                    )}
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className={`w-full text-base font-medium h-12 sm:h-14 rounded-3xl transition-colors border-2 ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-[#8E8E93] border-[#8E8E93]'
                    }`}
                  >
                    Login
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
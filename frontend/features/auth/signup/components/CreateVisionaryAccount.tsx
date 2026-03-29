"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FloatingLabelInput } from "@/components/FloatingLabelInput"
import { useSignUpStore } from "@/stores/signupStore"

interface CreateVisionaryAccountProps {
  onBack?: () => void
}

export default function CreateVisionaryAccount({ onBack }: CreateVisionaryAccountProps) {
  const router = useRouter()
  const { setEmail, setPassword, setConfirmPassword } = useSignUpStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form state
  const [email, setEmailValue] = useState("")
  const [password, setPasswordValue] = useState("")
  const [confirmPassword, setConfirmPasswordValue] = useState("")

  // Error state
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    return ""
  }

  const validateConfirmPassword = (value: string, passwordValue: string) => {
    if (!value) return "Please confirm your password"
    if (value !== passwordValue) return "Passwords don't match"
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    const confirmPasswordErr = validateConfirmPassword(confirmPassword, password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)
    setConfirmPasswordError(confirmPasswordErr)

    // If no errors, proceed
    if (!emailErr && !passwordErr && !confirmPasswordErr) {
      setEmail(email)
      setPassword(password)
      setConfirmPassword(confirmPassword)
      console.log("Form submitted with data:", { email, password, confirmPassword })
      // Navigate to on-boarding page
      router.push('/on-boarding')
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const isFormValid = email.length > 0 && password.length > 0 && confirmPassword.length > 0

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col justify-between min-h-[500px]">
          {/* Back Button - Aligned with card's left edge */}
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition mb-6"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Main Card - Responsive */}
          <div 
            className="bg-white w-full rounded-[42px] border border-black border-opacity-30"
            style={{
              maxWidth: '1008px'
            }}
          >
            {/* Desktop Layout */}
            <div 
              className="hidden lg:block pt-[72px] pr-[42px] pb-[48px] pl-[42px]"
            >
              <div className="grid grid-cols-2 items-center h-full gap-16">
                {/* Left Section */}
                <div className="flex flex-col justify-center">
                  <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mb-8" />
                  <h1 className="text-gray-900 font-medium text-4xl leading-[130%] tracking-[-0.5%]">
                    Create a Visionary<br />Account
                  </h1>
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

                  {/* Password and Confirm Password Row */}
                  <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex flex-col gap-1">
                      <FloatingLabelInput
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPasswordValue(e.target.value)}
                        showToggle={true}
                        isPasswordVisible={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        error={!!confirmPasswordError}
                      />
                      {confirmPasswordError && (
                        <span className="text-sm text-red-500">{confirmPasswordError}</span>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full text-base font-medium h-12 rounded-[50px] transition-colors border-2 ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Next
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
                  Create a Visionary Account
                </h1>

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

                  {/* Password and Confirm Password - Stacked on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="flex flex-col gap-1">
                      <FloatingLabelInput
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPasswordValue(e.target.value)}
                        showToggle={true}
                        isPasswordVisible={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        error={!!confirmPasswordError}
                      />
                      {confirmPasswordError && (
                        <span className="text-sm text-red-500">{confirmPasswordError}</span>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full text-base font-medium h-12 sm:h-14 rounded-3xl transition-colors border-2 ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Next
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
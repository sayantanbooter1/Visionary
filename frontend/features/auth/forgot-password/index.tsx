"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FloatingLabelInput } from "@/components/FloatingLabelInput"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [email, setEmailValue] = useState("")

  // Error state
  const [emailError, setEmailError] = useState("")

  // Validation function
  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    const emailErr = validateEmail(email)
    setEmailError(emailErr)

    // If no errors, proceed
    if (!emailErr) {
      console.log("Forgot password form submitted with data:", { email })
      setIsSubmitting(true)
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        toast.success("Password reset link sent!", {
          description: "Check your email for the password reset link.",
          duration: 3000,
        })
        // Optionally redirect back to signin
        setTimeout(() => router.push("/signin"), 2000)
      }, 2000)
    }
  }

  const isFormValid = email.length > 0

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col justify-between min-h-[500px] w-full max-w-[1008px]">
          {/* Back Button - Aligned with card's left edge */}
          <button
            onClick={() => router.back()}
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
                  <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mb-8" />
                  <h1 className="text-gray-900 font-medium text-4xl leading-[130%] tracking-[-0.5%] mb-4">
                    Forgot Your<br />Password?
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

                  {/* Send Reset Link Button */}
                  <Button
                    type="submit"
                    className={`w-full text-base font-medium h-12 rounded-[50px] transition-colors border-2 ${
                      isFormValid && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-[#8E8E93] border-[#8E8E93]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send me Password reset link "
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-6 sm:p-8">
              <div className="flex flex-col items-center text-center space-y-8">
                
                {/* Logo */}
                <div>
                  <img src="/logo.png" alt="Logo" className="w-[79.74px] h-[58.57px] mx-auto" />
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-gray-900 font-medium text-2xl sm:text-3xl leading-[130%] tracking-[-0.5%] mb-4">
                    Reset Your Password
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

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

                  {/* Send Reset Link Button */}
                  <Button
                    type="submit"
                    className={`w-full text-base font-medium h-12 sm:h-14 rounded-3xl transition-colors border-2 ${
                      isFormValid && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white text-[#8E8E93] border-[#8E8E93]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
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
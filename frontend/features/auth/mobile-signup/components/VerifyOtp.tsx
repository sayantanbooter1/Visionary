"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useSignUpStore } from "@/stores/signupStore"

interface VerifyOtpProps {
  onBack?: () => void
}

export default function VerifyOtp({ onBack }: VerifyOtpProps) {
  const router = useRouter()
  const { phoneNumber } = useSignUpStore()
  const [otpValue, setOtpValue] = useState("")
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [resendTimer, setResendTimer] = useState(20)
  const [canResend, setCanResend] = useState(false)

  // Timer countdown for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleResendOtp = () => {
    console.log("Resending OTP to:", phoneNumber)
    setResendTimer(20)
    setCanResend(false)
    setIsError(false)
    setErrorMessage("")
    setOtpValue("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[1000px] flex flex-col justify-between min-h-[500px]">
          {/* Back Button - Aligned with card's left edge */}
          <button
            onClick={handleBack}
            className="self-start flex items-center justify-center hover:bg-gray-50 transition mb-6"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '42px',
              border: '1px solid #8E8E93',
              backgroundColor: 'white'
            }}
          >
            <ArrowLeft className="w-8 h-8 text-gray-600" />
          </button>

          {/* Main Card - Responsive */}
          <div 
            className="bg-white w-full rounded-[42px]"
            style={{
              border: '1px solid #8E8E93'
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
                <div className="flex flex-col gap-8 justify-center items-center">
                  {/* OTP Message */}
                  <div className="text-center">
                    <p className="text-gray-600 text-base">
                      Please enter the OTP received on your phone number
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-4">
                    <InputOTP
                      maxLength={5}
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value)
                        setIsError(false)
                        setErrorMessage("")

                        // Auto-verify when all 5 digits are entered
                        if (value.length === 5) {
                          // Simulate OTP verification - you can replace this with actual logic
                          if (value === "12345") {
                            setIsError(false)
                            setErrorMessage("")
                            console.log("OTP verification successful")
                            // Navigate to on-boarding page after successful verification
                            router.push('/on-boarding')
                          } else {
                            setIsError(true)
                            setErrorMessage("Entered OTP is wrong")
                          }
                        }
                      }}
                    >
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot
                          index={0}
                          className={`w-16 h-16 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={1}
                          className={`w-16 h-16 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={2}
                          className={`w-16 h-16 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={3}
                          className={`w-16 h-16 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={4}
                          className={`w-16 h-16 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </InputOTPGroup>
                    </InputOTP>

                    {/* Error Message */}
                    {isError && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Button */}
                  <Button
                    onClick={canResend ? handleResendOtp : undefined}
                    disabled={!canResend}
                    className={`w-full text-base font-medium transition-colors ${
                      canResend 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white text-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      height: '56px',
                      borderRadius: '50px',
                      border: canResend ? 'none' : '2px solid #8E8E93'
                    }}
                  >
                    {canResend ? 'Resend' : `Resend ${formatTime(resendTimer)}`}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tablet Layout */}
            <div className="hidden md:block lg:hidden p-8">
              <div className="flex flex-col items-center text-center space-y-8">
                
                {/* Logo */}
                <div>
                  <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-gray-900 font-medium text-3xl leading-[130%] tracking-[-0.5%]">
                  Create a Visionary Account
                </h1>

                {/* OTP Section */}
                <div className="w-full max-w-md space-y-6">
                  {/* OTP Message */}
                  <div className="text-center">
                    <p className="text-gray-600 text-base">
                      Please enter the OTP received on your phone number
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-4">
                    <InputOTP
                      maxLength={5}
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value)
                        setIsError(false)
                        setErrorMessage("")

                        if (value.length === 5) {
                          if (value === "12345") {
                            setIsError(false)
                            setErrorMessage("")
                            console.log("OTP verification successful")
                            router.push('/on-boarding')
                          } else {
                            setIsError(true)
                            setErrorMessage("Entered OTP is wrong")
                          }
                        }
                      }}
                    >
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot
                          index={0}
                          className={`w-14 h-14 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={1}
                          className={`w-14 h-14 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={2}
                          className={`w-14 h-14 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={3}
                          className={`w-14 h-14 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={4}
                          className={`w-14 h-14 text-lg text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </InputOTPGroup>
                    </InputOTP>

                    {/* Error Message */}
                    {isError && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Button */}
                  <Button
                    onClick={canResend ? handleResendOtp : undefined}
                    disabled={!canResend}
                    className={`w-full text-base font-medium transition-colors ${
                      canResend 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white text-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      height: '56px',
                      borderRadius: '28px',
                      border: canResend ? 'none' : '2px solid #8E8E93'
                    }}
                  >
                    {canResend ? 'Resend' : `Resend ${formatTime(resendTimer)}`}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden p-6">
              <div className="flex flex-col items-center text-center space-y-6">
                
                {/* Logo */}
                <div>
                  <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-gray-900 font-medium text-xl leading-[130%] tracking-[-0.5%]">
                  Create a Visionary Account
                </h1>

                {/* OTP Section */}
                <div className="w-full space-y-6">
                  {/* OTP Message */}
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Please enter the OTP received on your phone number
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-4">
                    <InputOTP
                      maxLength={5}
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value)
                        setIsError(false)
                        setErrorMessage("")

                        if (value.length === 5) {
                          if (value === "12345") {
                            setIsError(false)
                            setErrorMessage("")
                            console.log("OTP verification successful")
                            router.push('/on-boarding')
                          } else {
                            setIsError(true)
                            setErrorMessage("Entered OTP is wrong")
                          }
                        }
                      }}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                          index={0}
                          className={`w-12 h-12 text-base text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={1}
                          className={`w-12 h-12 text-base text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={2}
                          className={`w-12 h-12 text-base text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={3}
                          className={`w-12 h-12 text-base text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <InputOTPSlot
                          index={4}
                          className={`w-12 h-12 text-base text-black border-2 rounded-lg ${isError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </InputOTPGroup>
                    </InputOTP>

                    {/* Error Message */}
                    {isError && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Button */}
                  <Button
                    onClick={canResend ? handleResendOtp : undefined}
                    disabled={!canResend}
                    className={`w-full text-base font-medium transition-colors ${
                      canResend 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white text-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      height: '48px',
                      borderRadius: '24px',
                      border: canResend ? 'none' : '2px solid #8E8E93'
                    }}
                  >
                    {canResend ? 'Resend' : `Resend ${formatTime(resendTimer)}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

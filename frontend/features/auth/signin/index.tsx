"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import LoginWithEmail from "./components/LoginWithEmail"
import { initiateGoogleLogin } from "@/services/authService"

export default function SignInPage() {
  const [showEmailLogin, setShowEmailLogin] = useState(false)

  const handleBackFromEmailLogin = () => {
    setShowEmailLogin(false)
  }

  if (showEmailLogin) {
    return <LoginWithEmail onBack={handleBackFromEmailLogin} />
  }
  
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[988px]">
          {/* Main Card - Responsive Design */}
          <div 
            className="bg-white mx-auto"
            style={{
              borderRadius: '42px',
              width: '100%',
              maxWidth: '988px',
              border: '1px solid rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Desktop Layout */}
            <div className="hidden lg:block" style={{ padding: '72px 42px 48px 42px' }}>
              <div className="grid grid-cols-2 items-center" style={{ gap: '64px' }}>
                
                {/* Left Section - Logo and Title */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Logo */}
                    <div className="mb-8">
                      <img src="/logo.png" alt="Visionary Logo" className="w-[86px] h-[86px]" />
                    </div>

                    {/* Title */}
                    <h1 className="text-gray-900 mb-8 font-medium text-4xl leading-[130%] tracking-[-0.5%]">
                      Login to Your Visionary Account
                    </h1>
                  </div>

                  {/* Create account link */}
                  <div>
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium text-base">
                      Create an Account
                    </Link>
                  </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex flex-col justify-center space-y-6">
                  {/* Login Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Login with Mobile Button */}
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium h-14"
                      style={{
                        borderRadius: '50px',
                        paddingTop: '17px',
                        paddingBottom: '17px'
                      }}
                    >
                      Login with Mobile
                    </Button>

                    {/* Login with Email Button */}
                    <Button
                      onClick={() => setShowEmailLogin(true)}
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 text-base font-medium hover:bg-blue-50 hover:text-blue-600 h-14"
                      style={{
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        borderRadius: '50px',
                        paddingTop: '17px',
                        paddingBottom: '17px'
                      }}
                    >
                      Login with Email & Password
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-sm font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center" style={{ gap: '15px' }}>
                    <Button
                      onClick={initiateGoogleLogin}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 transition-colors"
                      style={{
                        width: '54px',
                        height: '56px',
                        borderRadius: '6px',
                        borderWidth: '1px',
                        padding: '15px',
                        borderColor: '#d1d5db'
                      }}
                    >
                      <img src="/Google Icon.png" alt="Google" className="w-full h-full object-contain" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 transition-colors"
                      style={{
                        width: '54px',
                        height: '56px',
                        borderRadius: '6px',
                        borderWidth: '1px',
                        padding: '15px',
                        borderColor: '#d1d5db'
                      }}
                    >
                      <img src="/apple-icon.png" alt="Apple" className="w-full h-full object-contain" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 transition-colors"
                      style={{
                        width: '54px',
                        height: '56px',
                        borderRadius: '6px',
                        borderWidth: '1px',
                        padding: '15px',
                        borderColor: '#d1d5db'
                      }}
                    >
                      <img src="/microsoft-icon.png" alt="Microsoft" className="w-full h-full object-contain" />
                    </Button>
                  </div>

                  {/* Terms Text - Desktop */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-blue-600 hover:text-blue-700 font-medium">
                      {/* Empty div to maintain spacing */}
                    </div>
                    <p className="text-gray-500">
                      By continuing you agree to our{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-6 sm:p-8">
              <div className="flex flex-col items-center text-center space-y-8">
                
                {/* Logo */}
                <div>
                  <img src="/logo.png" alt="Visionary Logo" className="w-[86px] h-[86px] mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-gray-900 leading-tight font-medium text-3xl leading-[130%] tracking-[-0.5%]">
                  Login to Your Visionary Account
                </h1>

                {/* Login Buttons */}
                <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Login with Mobile Button */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium h-12 sm:h-14"
                    style={{
                      borderRadius: '24px',
                      paddingTop: '17px',
                      paddingBottom: '17px'
                    }}
                  >
                    Login with Mobile
                  </Button>

                  {/* Login with Email Button */}
                  <Button
                    onClick={() => setShowEmailLogin(true)}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 text-base font-medium hover:bg-blue-50 hover:text-blue-600 h-12 sm:h-14"
                    style={{
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      borderRadius: '24px',
                      paddingTop: '17px',
                      paddingBottom: '17px'
                    }}
                  >
                    Login with Email & Password
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-gray-400 text-sm font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={initiateGoogleLogin}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      borderWidth: '1px',
                      padding: '12px',
                      borderColor: '#d1d5db'
                    }}
                  >
                    <img src="/Google Icon.png" alt="Google" className="w-full h-full object-contain" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      borderWidth: '1px',
                      padding: '12px',
                      borderColor: '#d1d5db'
                    }}
                  >
                    <img src="/apple-icon.png" alt="Apple" className="w-full h-full object-contain" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      borderWidth: '1px',
                      padding: '12px',
                      borderColor: '#d1d5db'
                    }}
                  >
                    <img src="/microsoft-icon.png" alt="Microsoft" className="w-full h-full object-contain" />
                  </Button>
                </div>

                {/* Bottom section - Create account and Terms */}
                <div className="flex flex-col space-y-4">
                  {/* Create account link */}
                  <div className="text-center">
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium text-base">
                      Create an Account
                    </Link>
                  </div>
                  
                  {/* Terms Text */}
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      By continuing you agree to our{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
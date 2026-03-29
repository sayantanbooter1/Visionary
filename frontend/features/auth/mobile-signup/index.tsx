"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PhoneInput } from "@/components/Phone-input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSignUpStore } from "@/stores/signupStore"

const formSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
})

type FormData = z.infer<typeof formSchema>

interface MobileSignUpProps {
  onBack?: () => void
}

export function MobileSignUp({ onBack }: MobileSignUpProps) {
  const router = useRouter()
  const { setPhoneNumber } = useSignUpStore()
  const [phoneValue, setPhoneValue] = useState<string>("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  })

  // Check if form is valid
  const isFormValid = phoneValue && phoneValue.length > 0

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  function onSubmit(data: FormData) {
    console.log("=== FORM SUBMISSION ===")
    console.log("Form data:", data)
    console.log("Phone value from state:", phoneValue)
    console.log("Phone value length:", phoneValue.length)
    console.log("Phone value type:", typeof phoneValue)
    
    // Store phone number in Zustand store
    setPhoneNumber(phoneValue)
    
    // Navigate to verify-otp page
    router.push('/verify-otp')
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[1000px] flex flex-col justify-between min-h-[500px]">
          {/* Back Button - Aligned with card's left edge */}
          <button
            onClick={handleBack}
            className="self-start flex items-center justify-center mb-6 w-16 h-16 rounded-[42px] border border-[#8E8E93] bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-10 h-10 text-gray-600" />
          </button>

          {/* Main Card - Responsive */}
          <div className="bg-white w-full rounded-[42px] border border-[#8E8E93]">
            {/* Desktop Layout */}
            <div className="hidden lg:block pt-[72px] pr-[42px] pb-[48px] pl-[42px]">
              <div className="grid grid-cols-2 items-center h-full gap-16">
                {/* Left Section */}
                <div className="flex flex-col justify-center">
                  <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mb-8" />
                  <h1 className="text-gray-900 font-medium text-4xl leading-[130%] tracking-[-0.5%]">
                    Create a Visionary<br />Account
                  </h1>
                </div>

                {/* Right Section */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 justify-center max-w-[432px]">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <PhoneInput
                      value={phoneValue}
                      onChange={(value) => {
                        console.log("Phone value changed:", value)
                        setPhoneValue(value || "")
                        form.setValue("phone", value || "")
                      }}
                      placeholder="Enter Your Phone"
                      className="w-full"
                    />
                  </div>

                  {/* Send OTP Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full max-w-[432px] h-14 text-base font-medium rounded-[50px] transition-colors ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
                        : 'bg-white text-gray-400 cursor-not-allowed border-2 border-[#8E8E93]'
                    }`}
                  >
                    Send OTP
                  </Button>
                </form>
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

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[432px] space-y-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <PhoneInput
                      value={phoneValue}
                      onChange={(value) => {
                        console.log("Phone value changed:", value)
                        setPhoneValue(value || "")
                        form.setValue("phone", value || "")
                      }}
                      placeholder="Enter Your Phone"
                      className="w-full"
                    />
                  </div>

                  {/* Send OTP Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full max-w-[432px] h-14 text-base font-medium rounded-[28px] transition-colors ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
                        : 'bg-white text-gray-400 cursor-not-allowed border-2 border-[#8E8E93]'
                    }`}
                  >
                    Send OTP
                  </Button>
                </form>
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

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[432px] space-y-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <PhoneInput
                      value={phoneValue}
                      onChange={(value) => {
                        console.log("Phone value changed:", value)
                        setPhoneValue(value || "")
                        form.setValue("phone", value || "")
                      }}
                      placeholder="Enter Your Phone"
                      className="w-full"
                    />
                  </div>

                  {/* Send OTP Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full max-w-[432px] h-12 text-base font-medium rounded-[24px] transition-colors ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
                        : 'bg-white text-gray-400 cursor-not-allowed border-2 border-[#8E8E93]'
                    }`}
                  >
                    Send OTP
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

export default MobileSignUp
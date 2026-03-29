"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OrganizationProps {
  onBack: () => void
}

export default function Organization({ onBack }: OrganizationProps) {
  const router = useRouter()
  const [organizationName, setOrganizationName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [organizationType, setOrganizationType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleContinue = () => {
    console.log("Organization form data:", {
      organizationName,
      contactPerson,
      organizationType
    })

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      toast.success("Organization registered successfully!", {
        description: "Your account has been created and you can now access the dashboard.",
        duration: 3000,
      })
    }, 2000)
  }

  const handleProceedToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col min-h-[600px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="self-start w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition mb-8"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-12 md:p-16 shadow-lg min-h-[500px] flex flex-col items-center justify-center flex-1">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-8" />

          {/* Welcome Text */}
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
            Welcome to Visionary
          </h1>

          {/* Form */}
          <div className="w-full max-w-lg space-y-6">
            <Input
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
            />

            <Input
              placeholder="Contact Person Name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
            />

            <Input
              placeholder="Organization Type (School, College, etc.)"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              className="w-full h-14 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
            />

            <Button
              onClick={isSubmitted ? handleProceedToDashboard : handleContinue}
              disabled={(!organizationName || !contactPerson || !organizationType) || isSubmitting}
              className={`w-full rounded-full py-6 text-base font-medium mt-8 transition-colors flex items-center justify-center gap-2 ${(!organizationName || !contactPerson || !organizationType) || isSubmitting
                ? "bg-transparent border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : isSubmitted ? (
                <>
                  Proceed to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                "Submit Details"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useSignUpStore, Category as CategoryEnum, type CategoryType } from "@/stores/signupStore"
import Student from "./student"
import Teacher from "./teacher"
import Organization from "./organization"

interface CategoryProps {
  onBack?: () => void
}

export default function Category({ onBack }: CategoryProps) {
  const router = useRouter()
  const { category, setCategory } = useSignUpStore()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(category)
  const [showNextStep, setShowNextStep] = useState(false)

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category)
    setCategory(category)
  }

  const handleContinue = () => {
    if (selectedCategory) {
      console.log("Selected category:", selectedCategory)
      setShowNextStep(true)
    }
  }

  const handleBack = () => {
    setShowNextStep(false)
  }

  // Show the appropriate component based on selected category
  if (showNextStep && selectedCategory) {
    switch (selectedCategory) {
      case CategoryEnum.STUDENT:
        return <Student onBack={handleBack} />
      case CategoryEnum.TEACHER:
        return <Teacher onBack={handleBack} />
      case CategoryEnum.ORGANIZATION:
        return <Organization onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className="w-full bg-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full flex items-center justify-center">
        {/* Main Card - Following Figma specs: width: 988px, height: 561px, border-radius: 42px */}
        <div 
          className="bg-white flex flex-col items-center justify-center mx-auto"
          style={{
            width: '800px',
            height: '500px',
            borderRadius: '42px',
            paddingTop: '72px',
            paddingRight: '42px',
            paddingBottom: '48px',
            paddingLeft: '42px',
            border: '1px solid #8E8E93'
          }}
        >
          {/* Logo - Visionary logo from public */}
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="Visionary Logo" 
              style={{
                width: '86px',
                height: '86px',
                opacity: 1
              }}
            />
          </div>
          
          {/* Welcome Text */}
          <h1 
            className="text-gray-900 text-center mb-16"
            style={{
              fontFamily: 'Google Sans, sans-serif',
              fontWeight: 500,
              fontSize: '36px',
              lineHeight: '130%',
              letterSpacing: '-0.5%',
              textAlign: 'center'
            }}
          >
            Welcome to Visionary
          </h1>

          {/* Select your category text and Category Buttons container */}
          <div className="flex flex-col items-start">
            {/* Select your category text */}
            <p className="text-gray-600 text-lg mb-8">
              Select your category:
            </p>

            {/* Category Buttons */}
            <div className="flex gap-4 mb-12">
            <button
              onClick={() => handleCategorySelect(CategoryEnum.STUDENT)}
              className={`text-base font-medium transition-all ${
                selectedCategory === CategoryEnum.STUDENT
                  ? "bg-blue-100 text-blue-600 border border-blue-200"
                  : "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
              style={{
                width: '199.33px',
                height: '56px',
                borderRadius: '50px',
                paddingTop: '21px',
                paddingRight: '24px',
                paddingBottom: '21px',
                paddingLeft: '24px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Student
            </button>

            <button
              onClick={() => handleCategorySelect(CategoryEnum.TEACHER)}
              className={`text-base font-medium transition-all ${
                selectedCategory === CategoryEnum.TEACHER
                  ? "bg-blue-100 text-blue-600 border border-blue-200"
                  : "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
              style={{
                width: '199.33px',
                height: '56px',
                borderRadius: '50px',
                paddingTop: '21px',
                paddingRight: '24px',
                paddingBottom: '21px',
                paddingLeft: '24px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Teacher
            </button>

            <button
              onClick={() => handleCategorySelect(CategoryEnum.ORGANIZATION)}
              className={`text-base font-medium transition-all ${
                selectedCategory === CategoryEnum.ORGANIZATION
                  ? "bg-blue-100 text-blue-600 border border-blue-200"
                  : "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
              style={{
                width: '199.33px',
                height: '56px',
                borderRadius: '50px',
                paddingTop: '21px',
                paddingRight: '24px',
                paddingBottom: '21px',
                paddingLeft: '24px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Organization
            </button>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedCategory}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-base font-medium"
            style={{
              width: '624px',
              height: '48px',
              borderRadius: '24px',
              paddingTop: '17px',
              paddingBottom: '17px'
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
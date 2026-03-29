"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSignUpStore, Board } from "@/stores/signupStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface StudentProps {
  onBack: () => void
}

export default function Student({ onBack }: StudentProps) {
  const router = useRouter()
  const { setFullName, setSelectGrade, setSelectBoard } = useSignUpStore()
  const [fullName, setFullNameLocal] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedBoard, setSelectedBoard] = useState("")
  const [customBoard, setCustomBoard] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleContinue = () => {
    const boardValue = selectedBoard === Board.OTHER ? customBoard : selectedBoard

    console.log("Student form data:", {
      fullName,
      selectedGrade,
      selectedBoard,
      customBoard,
      finalBoardValue: boardValue
    })

    // Save student data to Zustand store
    setFullName(fullName)
    setSelectGrade(selectedGrade)
    setSelectBoard(boardValue as any)

    // Start submission process
    setIsSubmitting(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Show success toast
      toast.success("Student registered successfully!", {
        description: "Your account has been created and you can now access the dashboard.",
        duration: 3000,
      })
    }, 2000) // 2 second delay to simulate API call
  }

  const handleProceedToDashboard = () => {
    router.push("/dashboard")
  }

  const handleBoardSelection = (board: string) => {
    setSelectedBoard(board)
    // Clear custom board when selecting predefined options
    if (board !== Board.OTHER) {
      setCustomBoard("")
    }
  }

  const grades = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12"
  ]

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col justify-center w-full max-w-[800px]">
          {/* Main Card - Responsive */}
          <div 
            className="bg-white w-full rounded-[42px] border border-gray-400 pt-[64px] pr-[48px] pb-[52px] pl-[48px]"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Logo */}
              <img src="/logo.png" alt="Logo" className="w-[86px] h-[86px] mb-6" />

              {/* Welcome Text */}
              <h1 className="text-gray-900 font-medium text-[36px] leading-[130%] tracking-[-0.005em] mb-8 text-center">
                Welcome to Visionary
              </h1>

              {/* Form */}
              <div className="w-full max-w-[550px] space-y-5">
                {/* Full Name Input */}
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullNameLocal(e.target.value)}
                  className="w-full h-14 px-4 text-base text-black border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0"
                />

                {/* Grade Select */}
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-full !h-14 !px-4 text-base text-black border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 data-[size=default]:!h-14">
                    <SelectValue placeholder="Select Grade" className="text-base" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4} className="mt-1">
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade} className="!py-2 !px-4 text-base">
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Select Board Label */}
                <div className="text-left">
                  <p className="text-gray-700 text-base font-normal mb-4">Select Board</p>
                </div>

                {/* Board Selection Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => handleBoardSelection(Board.CBSE)}
                    className={`px-16 py-6 rounded-full text-base font-normal transition-all border ${selectedBoard === Board.CBSE
                      ? "bg-blue-100 text-blue-600 border-blue-100"
                      : "bg-white text-gray-500 border-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    CBSE
                  </Button>

                  <Button
                    onClick={() => handleBoardSelection(Board.ICSE)}
                    className={`px-16 py-6 rounded-full text-base font-normal transition-all border ${selectedBoard === Board.ICSE
                      ? "bg-blue-100 text-blue-600 border-blue-100"
                      : "bg-white text-gray-500 border-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    ICSE
                  </Button>

                  <Button
                    onClick={() => handleBoardSelection(Board.OTHER)}
                    className={`px-16 py-6 rounded-full text-base font-normal transition-all border ${selectedBoard === Board.OTHER
                      ? "bg-white text-blue-600 border-blue-600"
                      : "bg-white text-gray-500 border-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    Other
                  </Button>
                </div>

                {/* Custom Board Input - Show when "Other" is selected */}
                {selectedBoard === Board.OTHER && (
                  <div className="mt-4">
                    <Input
                      placeholder="Enter your board name"
                      value={customBoard}
                      onChange={(e) => setCustomBoard(e.target.value)}
                      className="w-full h-14 px-4 text-base text-black border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0"
                    />
                  </div>
                )}

                {/* Continue/Submit Button */}
                <Button
                  onClick={isSubmitted ? handleProceedToDashboard : handleContinue}
                  disabled={(!fullName || !selectedGrade || !selectedBoard || (selectedBoard === Board.OTHER && !customBoard)) || isSubmitting}
                  className={`w-full rounded-full h-14 text-base font-normal mt-8 transition-colors flex items-center justify-center gap-2 border ${(!fullName || !selectedGrade || !selectedBoard || (selectedBoard === Board.OTHER && !customBoard)) || isSubmitting
                    ? "bg-white text-gray-400 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : isSubmitted ? (
                    <>
                      Proceed to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
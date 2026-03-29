import { create } from 'zustand'

// Enums as const objects
export const Category = {
  STUDENT: "student",
  TEACHER: "teacher",
  ORGANIZATION: "organization"
} as const

export const Board = {
  CBSE: "CBSE",
  ICSE: "ICSE",
  OTHER: "OTHER"
} as const

// Type definitions
export type CategoryType = typeof Category[keyof typeof Category]
export type BoardType = typeof Board[keyof typeof Board]

// Define the shape of signup form state
interface SignUpState {
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  category: CategoryType | null
  // Student specific fields
  fullName: string
  selectGrade: string
  selectBoard: BoardType | null
}

interface SignUpActions {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setConfirmPassword: (confirmPassword: string) => void
  setPhoneNumber: (phoneNumber: string) => void
  setCategory: (category: CategoryType) => void
  setFullName: (fullName: string) => void
  setSelectGrade: (selectGrade: string) => void
  setSelectBoard: (selectBoard: BoardType) => void
  resetForm: () => void
}

type SignUpStore = SignUpState & SignUpActions

const initialState: SignUpState = {
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  category: null,
  fullName: "",
  selectGrade: "",
  selectBoard: null,
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  ...initialState,
  
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setCategory: (category) => set({ category }),
  setFullName: (fullName) => set({ fullName }),
  setSelectGrade: (selectGrade) => set({ selectGrade }),
  setSelectBoard: (selectBoard) => set({ selectBoard }),
  resetForm: () => set(initialState),
}))
import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FloatingLabelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  type?: string
  showToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePassword?: () => void
  error?: boolean
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({
    label,
    type = "text",
    showToggle = false,
    isPasswordVisible = false,
    onTogglePassword,
    error = false,
    onChange,
    onFocus,
    onBlur,
    value,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (onFocus) {
        onFocus(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value.length > 0)
      if (onBlur) {
        onBlur(e)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      // Call the onChange from react-hook-form registration
      if (onChange) {
        onChange(e)
      }
    }

    const isLabelFloating = isFocused || hasValue || value

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type === "password" && isPasswordVisible ? "text" : type}
          id={props.name}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 ${
            error 
              ? "border-red-400 focus:border-red-500" 
              : "border-gray-400 focus:border-blue-600"
          }`}
          placeholder=" "
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={props.name}
          className={`absolute text-sm duration-300 transform bg-white px-2 pointer-events-none ${
            isLabelFloating
              ? "-translate-y-4 scale-75 top-2 z-10 origin-left"
              : "scale-100 -translate-y-1/2 top-1/2"
          } start-1 ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          {label}
        </label>

        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isPasswordVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    )
  }
)

FloatingLabelInput.displayName = "FloatingLabelInput"
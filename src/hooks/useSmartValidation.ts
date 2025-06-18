
import { useState, useCallback, useEffect } from "react"
import { debounce } from "lodash"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface UseSmartValidationProps {
  rules?: ValidationRule
  validateOnChange?: boolean
  validateOnBlur?: boolean
  debounceMs?: number
}

export function useSmartValidation({
  rules = {},
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300
}: UseSmartValidationProps = {}) {
  const [value, setValue] = useState("")
  const [validationState, setValidationState] = useState<"idle" | "validating" | "valid" | "invalid">("idle")
  const [validationMessage, setValidationMessage] = useState<string>("")
  const [touched, setTouched] = useState(false)

  const validateValue = useCallback((val: string) => {
    if (!rules || Object.keys(rules).length === 0) {
      setValidationState("idle")
      setValidationMessage("")
      return
    }

    // Required validation
    if (rules.required && !val.trim()) {
      setValidationState("invalid")
      setValidationMessage("This field is required")
      return
    }

    // Skip other validations if empty and not required
    if (!val.trim() && !rules.required) {
      setValidationState("idle")
      setValidationMessage("")
      return
    }

    // Length validations
    if (rules.minLength && val.length < rules.minLength) {
      setValidationState("invalid")
      setValidationMessage(`Minimum ${rules.minLength} characters required`)
      return
    }

    if (rules.maxLength && val.length > rules.maxLength) {
      setValidationState("invalid")
      setValidationMessage(`Maximum ${rules.maxLength} characters allowed`)
      return
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(val)) {
      setValidationState("invalid")
      setValidationMessage("Invalid format")
      return
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(val)
      if (customError) {
        setValidationState("invalid")
        setValidationMessage(customError)
        return
      }
    }

    // All validations passed
    setValidationState("valid")
    setValidationMessage("Looks good!")
  }, [rules])

  const debouncedValidate = useCallback(
    debounce((val: string) => {
      validateValue(val)
    }, debounceMs),
    [validateValue, debounceMs]
  )

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
    
    if (validateOnChange && touched) {
      setValidationState("validating")
      debouncedValidate(newValue)
    }
  }, [validateOnChange, touched, debouncedValidate])

  const handleBlur = useCallback(() => {
    setTouched(true)
    
    if (validateOnBlur) {
      validateValue(value)
    }
  }, [validateOnBlur, value, validateValue])

  return {
    value,
    setValue: handleChange,
    validationState,
    validationMessage,
    touched,
    onBlur: handleBlur,
    reset: () => {
      setValue("")
      setValidationState("idle")
      setValidationMessage("")
      setTouched(false)
    }
  }
}

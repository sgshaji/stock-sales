
import * as React from "react"
import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationMessageProps {
  type: "error" | "success" | "info"
  message: string
  className?: string
}

export function ValidationMessage({ type, message, className }: ValidationMessageProps) {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info
  }
  
  const Icon = icons[type]
  
  return (
    <div className={cn(
      "flex items-center gap-2 text-sm mt-1 animate-fade-in",
      {
        "text-destructive": type === "error",
        "text-success-600 dark:text-success-400": type === "success",
        "text-info-600 dark:text-info-400": type === "info"
      },
      className
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  validationState?: "idle" | "validating" | "valid" | "invalid"
  validationMessage?: string
  showValidation?: boolean
}

export const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ className, label, hint, validationState = "idle", validationMessage, showValidation = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              {
                "border-destructive focus-visible:ring-destructive/20": validationState === "invalid",
                "border-success-300 focus-visible:ring-success-300/20": validationState === "valid",
                "ring-2 ring-ring/10": isFocused
              },
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {validationState === "validating" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            </div>
          )}
          
          {validationState === "valid" && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success-600" />
          )}
          
          {validationState === "invalid" && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        
        {hint && !validationMessage && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        
        {showValidation && validationMessage && (
          <ValidationMessage 
            type={validationState === "invalid" ? "error" : validationState === "valid" ? "success" : "info"}
            message={validationMessage}
          />
        )}
      </div>
    )
  }
)
SmartInput.displayName = "SmartInput"

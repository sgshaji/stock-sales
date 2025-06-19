import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 button-press relative overflow-hidden",
  {
    variants: {
      variant: {
        // Primary CTA - high emphasis, most important action
        default: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg active:bg-primary-800 shadow-md border-0 font-semibold",
        
        // Destructive actions - clear warning
        destructive: "bg-error-600 text-white hover:bg-error-700 hover:shadow-lg active:bg-error-800 shadow-md border-0 font-semibold",
        
        // Secondary actions - medium emphasis
        outline: "border-2 border-border/40 bg-background/80 hover:bg-accent/50 hover:text-accent-foreground hover:border-border/60 hover:shadow-sm font-medium backdrop-blur-sm",
        
        // Lower emphasis supporting actions
        secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:shadow-sm font-medium",
        
        // Minimal actions - lowest emphasis
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm font-medium rounded-xl",
        
        // Text links - inline actions
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium",
        
        // Success actions - positive feedback
        success: "bg-success-600 text-white hover:bg-success-700 hover:shadow-lg active:bg-success-800 shadow-md border-0 font-semibold",
        
        // Warning actions - attention needed
        warning: "bg-warning-600 text-white hover:bg-warning-700 hover:shadow-lg active:bg-warning-800 shadow-md border-0 font-semibold",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base font-semibold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-xl",
        "icon-lg": "h-12 w-12",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <>
            <div className="absolute inset-0 bg-current opacity-10 animate-pulse" />
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </>
        )}
        {loading ? (loadingText || "Loading...") : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
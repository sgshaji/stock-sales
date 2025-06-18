
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 button-press",
  {
    variants: {
      variant: {
        // Primary CTA - high emphasis
        default: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg active:bg-primary-800 shadow-md border-0",
        
        // Destructive actions
        destructive: "bg-error-600 text-white hover:bg-error-700 hover:shadow-lg active:bg-error-800 shadow-md border-0",
        
        // Secondary actions
        outline: "border-2 border-primary-200 bg-background/80 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 hover:shadow-sm dark:border-primary-800 dark:hover:bg-primary-950/20 dark:hover:text-primary-400",
        
        // Lower emphasis
        secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:shadow-sm",
        
        // Minimal actions
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        
        // Text links
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
        
        // Success actions
        success: "bg-success-600 text-white hover:bg-success-700 hover:shadow-lg active:bg-success-800 shadow-md border-0",
        
        // Warning actions
        warning: "bg-warning-600 text-white hover:bg-warning-700 hover:shadow-lg active:bg-warning-800 shadow-md border-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }


import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "default"
  children: React.ReactNode
  className?: string
}

const StatusBadge = ({ variant, children, className }: StatusBadgeProps) => {
  const variants = {
    success: "bg-success-100 text-success-700 border-success-200",
    warning: "bg-warning-100 text-warning-700 border-warning-200", 
    danger: "bg-destructive-100 text-destructive-700 border-destructive-200",
    info: "bg-info-100 text-info-700 border-info-200",
    default: "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export { StatusBadge }

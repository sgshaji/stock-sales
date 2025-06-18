
import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "default"
  children: React.ReactNode
  className?: string
}

const StatusBadge = ({ variant, children, className }: StatusBadgeProps) => {
  const variants = {
    success: "bg-success-100 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800",
    warning: "bg-warning-100 text-warning-700 border-warning-200 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800", 
    danger: "bg-destructive-100 text-destructive-700 border-destructive-200 dark:bg-destructive-900/20 dark:text-destructive-400 dark:border-destructive-800",
    info: "bg-info-100 text-info-700 border-info-200 dark:bg-info-900/20 dark:text-info-400 dark:border-info-800",
    default: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export { StatusBadge }

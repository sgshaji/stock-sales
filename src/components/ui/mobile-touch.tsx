
import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  minHeight?: number
}

export function TouchTarget({ 
  children, 
  className, 
  minHeight = 44,
  ...props 
}: TouchTargetProps) {
  const isMobile = useIsMobile()
  
  return (
    <div
      className={cn(
        "relative",
        isMobile && `min-h-[${minHeight}px] flex items-center justify-center`,
        className
      )}
      style={isMobile ? { minHeight: `${minHeight}px` } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

interface SwipeableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function SwipeableCard({ 
  children, 
  className,
  onSwipeLeft,
  onSwipeRight,
  ...props 
}: SwipeableCardProps) {
  const [startX, setStartX] = React.useState<number | null>(null)
  const [currentX, setCurrentX] = React.useState<number | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const isMobile = useIsMobile()

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !startX) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isMobile || !startX || !currentX) return
    
    const diffX = startX - currentX
    const threshold = 100

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (diffX < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }

    setStartX(null)
    setCurrentX(null)
    setIsDragging(false)
  }

  const translateX = isDragging && startX && currentX ? currentX - startX : 0

  return (
    <div
      className={cn(
        "transition-transform duration-200 ease-out",
        isDragging && "select-none",
        className
      )}
      style={{
        transform: isDragging ? `translateX(${translateX}px)` : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children}
    </div>
  )
}

export function MobileStack({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const isMobile = useIsMobile()
  
  return (
    <div
      className={cn(
        "space-y-4",
        isMobile ? "flex flex-col" : "grid grid-cols-2 gap-6",
        className
      )}
    >
      {children}
    </div>
  )
}

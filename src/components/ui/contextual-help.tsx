
import * as React from "react"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ContextualHelpProps {
  title: string
  content: string
  trigger?: React.ReactNode
  className?: string
}

export function ContextualHelp({ 
  title, 
  content, 
  trigger,
  className 
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      onClick={() => setIsOpen(!isOpen)}
    >
      <HelpCircle className="h-4 w-4" />
      <span className="sr-only">Help</span>
    </Button>
  )

  return (
    <div className={cn("relative", className)}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}
      
      {isOpen && (
        <Card className="absolute z-50 w-80 top-full right-0 mt-2 shadow-lg border animate-scale-in">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProgressiveFormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  defaultExpanded?: boolean
  required?: boolean
  className?: string
}

export function ProgressiveFormSection({
  title,
  description,
  children,
  defaultExpanded = false,
  required = false,
  className
}: ProgressiveFormSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <Button
          variant="ghost"
          className="justify-start h-auto p-0 hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 w-full">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <CardTitle className="text-base flex items-center gap-2">
                {title}
                {required && <span className="text-destructive">*</span>}
              </CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 animate-fade-in">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

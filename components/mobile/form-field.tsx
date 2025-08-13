import type React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  helper?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, required = false, error, helper, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-white font-medium">
        {label}
        {required && <span className="text-[#FF4D8D] ml-1">*</span>}
      </Label>
      {children}
      {helper && !error && <p className="text-sm text-[#B4B6C2]">{helper}</p>}
      {error && <p className="text-sm text-[#FF4D8D]">{error}</p>}
    </div>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  addonPrefix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, addonPrefix, ...props }, ref) => {
  return (
    <div className={cn("flex items-center border rounded-md px-3 py-2 bg-background", className)}>
      {addonPrefix && <span className="mr-2 text-muted-foreground">{addonPrefix}</span>}
      <input
        type={type}
        className="flex-1 bg-transparent outline-none"
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = "Input"

export { Input } 
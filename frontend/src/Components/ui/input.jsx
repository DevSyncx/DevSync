import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Input = React.forwardRef(({ className, type, size, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input, inputVariants }

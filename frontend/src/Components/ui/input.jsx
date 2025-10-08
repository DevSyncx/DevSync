import * as React from "react"
import { cn } from "@/lib/utils"
import { inputVariants } from "@/lib/inputVariants"

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

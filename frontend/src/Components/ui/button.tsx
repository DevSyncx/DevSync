import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
    outline: "border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]",
    ghost: "hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]",
    link: "text-[var(--primary)] underline-offset-4 hover:underline",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2",
        variantStyles[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
import React from "react";
import { cn } from "@/lib/utils"; // if you have shadcn's `cn`, else remove

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-muted border-t-primary",
          sizes[size],
          className
        )}
      />
    </div>
  );
};

export default Loader;

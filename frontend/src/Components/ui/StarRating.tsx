import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export default function StarRating({
  count = 5,
  value = 0,
  onChange,
  size = 24,
  activeColor = "var(--accent)",
  inactiveColor = "var(--muted)",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleMouseMove = (newValue: number) => {
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (newValue: number) => {
    onChange(newValue);
  };

  const getFillColor = (starValue: number) => {
    const currentValue = hoverValue !== null ? hoverValue : value;
    return starValue <= currentValue ? activeColor : inactiveColor;
  };

  return (
    <div 
      className={cn("flex gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          fill={getFillColor(star)}
          stroke={getFillColor(star)}
          strokeWidth={0.5}
          onClick={() => handleClick(star)}
          onMouseMove={() => handleMouseMove(star)}
          className="cursor-pointer transition-transform hover:scale-110"
        />
      ))}
    </div>
  );
}
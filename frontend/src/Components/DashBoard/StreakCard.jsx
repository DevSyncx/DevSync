import { Flame } from "lucide-react";
import CardWrapper from "./CardWrapper";
import React, { useEffect } from "react";

export default function StreakCard({ streak }) {
  const safeStreak = streak ?? 0;
  
  // Log streak data for debugging
  useEffect(() => {
    console.log("StreakCard received streak:", streak);
  }, [streak]);

  // Create a visual representation of the streak
  const renderStreakBoxes = () => {
    const boxes = [];
    const maxBoxes = 7; // Show up to 7 days
    const displayCount = Math.min(safeStreak, maxBoxes);
    
    for (let i = 0; i < maxBoxes; i++) {
      // Active if current index is less than the streak
      const isActive = i < displayCount;
      boxes.push(
        <div 
          key={i} 
          className={`w-3 h-8 mx-1 rounded-sm ${isActive ? 'bg-[var(--accent)]' : 'bg-gray-200'}`}
        />
      );
    }
    return boxes;
  };

  return (
    <CardWrapper className="flex flex-col items-center justify-center p-6 bg-[var(--card)]">
      <Flame size={36} className="text-[var(--accent)] mb-2" />
      <span className="font-bold text-lg text-[var(--primary)]">{safeStreak} Days</span>
      <p className="text-sm text-[var(--muted-foreground)] mb-3">Current Streak</p>
      
      {/* Visual streak representation */}
      <div className="flex items-end justify-center mt-2 w-full">
        {renderStreakBoxes()}
      </div>
    </CardWrapper>
  );
}

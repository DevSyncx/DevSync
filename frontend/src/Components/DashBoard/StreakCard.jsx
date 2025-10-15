import React, { useEffect } from "react";
import { Flame } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";

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
    <Card className="flex flex-col items-center justify-center p-4 sm:p-6 w-full sm:w-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-col items-center gap-2">
        <Flame size={36} className="text-[var(--accent)]" />
        <span className="font-bold text-lg text-[var(--primary)]">{safeStreak} Days</span>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-[var(--muted-foreground)]">Current Streak</p>
        
        {/* Visual streak representation */}
        <div className="flex items-end justify-center mt-2 w-full">
          {renderStreakBoxes()}
        </div>
      </CardContent>
    </Card>
  );
}

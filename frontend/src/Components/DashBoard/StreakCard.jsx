import React from "react";
import { Flame } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";

export default function StreakCard({ streak }) {
  const safeStreak = streak ?? 0;

  return (
    <Card className="flex flex-col items-center justify-center p-4 sm:p-6 w-full sm:w-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-col items-center gap-2">
        <Flame size={36} className="text-[var(--accent)]" />
        <span className="font-bold text-lg text-[var(--primary)]">{safeStreak} Days</span>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-[var(--muted-foreground)]">Current Streak</p>
      </CardContent>
    </Card>
  );
}

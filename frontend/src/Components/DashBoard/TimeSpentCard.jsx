import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";

export default function TimeSpentCard({ time = "0h 0m" }) {
  return (
    <Card className="flex flex-col items-center justify-center p-4 sm:p-6 w-full sm:w-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-col items-center gap-2">
        <Clock size={32} className="text-[var(--accent)]" />
        <span className="font-semibold text-lg text-[var(--primary)]">{time}</span>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <p className="text-sm text-[var(--muted-foreground)]">Time Spent</p>
      </CardContent>
    </Card>
  );
}

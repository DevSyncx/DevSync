import { Flame } from "lucide-react";
import CardWrapper from "./CardWrapper";

export default function StreakCard({ streak }) {
  const safeStreak = streak ?? 0;

  return (
  <CardWrapper className="flex flex-col items-center justify-center p-6 bg-[var(--card)]">
  <Flame size={36} className="text-[var(--accent)] mb-2" />
  <span className="font-bold text-lg text-[var(--primary)]">{safeStreak} Days</span>
  <p className="text-sm text-[var(--muted-foreground)]">Current Streak</p>
    </CardWrapper>
  );
}

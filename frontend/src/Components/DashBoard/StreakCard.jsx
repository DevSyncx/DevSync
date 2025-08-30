import { Flame } from "lucide-react";
import CardWrapper from "./CardWrapper";

export default function StreakCard({ streak }) {
  const safeStreak = streak ?? 0;

  return (
    <CardWrapper className="flex flex-col items-center justify-center p-6 bg-white">
      <Flame size={36} className="text-orange-500 mb-2" />
      <span className="font-bold text-lg">{safeStreak} Days</span>
      <p className="text-sm text-gray-600">Current Streak</p>
    </CardWrapper>
  );
}

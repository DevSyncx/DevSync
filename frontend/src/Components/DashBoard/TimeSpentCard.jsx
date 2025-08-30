import { Clock } from "lucide-react";
import CardWrapper from "./CardWrapper";

export default function TimeSpentCard({ time = "0h 0m" }) {
  return (
    <CardWrapper className="flex flex-col items-center justify-center p-6">
      <Clock size={32} className="text-blue-500 mb-2" />
      <span className="font-semibold text-lg">{time}</span>
      <p className="text-sm text-gray-500">Time Spent</p>
    </CardWrapper>
  );
}

// src/Components/FeaturesSectionDemo.jsx
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  GitBranch,
  Clock,
  BookOpen,
  MessageCircle,
  TimerReset,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FeaturesSection() {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Unified Developer Dashboard",
      description: "Track GitHub, LeetCode, Codeforces, and more from a single dashboard.",
      icon: <Activity />,
      route: "/dashboard",
      isClickable: true,
    },
    {
      title: "Smart Productivity Logs",
      description: "Log tasks, wins, blockers, and progress with daily summaries.",
      icon: <BookOpen />,
      route: "/dashboard",
      isClickable: true,
    },
    {
      title: "Live Pomodoro Timer",
      description: "Focus with an integrated Pomodoro and break cycle tracker.",
      icon: <TimerReset />,
      route: "/pomodoro",
      isClickable: true,
    },
    {
      title: "Auto GitHub Sync",
      description: "Sync contributions, commits, and streaks automatically.",
      icon: <GitBranch />,
      route: "/profile",
      isClickable: true,
    },
    {
      title: "DSA Progress Tracking",
      description: "Keep tabs on your problem-solving journey across platforms.",
      icon: <Brain />,
      route: "/profile",
      isClickable: true,
    },
    {
      title: "Interactive Visualizations",
      description: "Understand your productivity via dynamic graphs and charts.",
      icon: <BarChart3 />,
      route: "/dashboard",
      isClickable: true,
    },
    {
      title: "Community Collaboration",
      description: "Connect, share logs, and grow together with other developers.",
      icon: <MessageCircle />,
      route: "/contributors",
      isClickable: true,
    },
    {
      title: "Time Management Tools",
      description: "Track how you spend your dev hours with real insights.",
      icon: <Clock />,
      route: "/dashboard",
      isClickable: true,
    },
  ];

  return (
    <div id="features" className=" bg-[#101e35] border border-[#1c2e4a] rounded-3xl p-8 md:p-12 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  route,
  isClickable,
  navigate,
}) => {
  const handleClick = () => {
    if (isClickable && route) {
      navigate(route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        "transition-all duration-300 ease-in-out",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-500",
        index < 4 && "lg:border-b dark:border-neutral-800",
        "hover:bg-[#1a2b47] hover:shadow-xl rounded-lg",
        isClickable && "cursor-pointer hover:scale-105"
      )}
    >
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover/feature:opacity-5 transition-opacity duration-300 rounded-lg"></div>

      <div className="mb-4 relative z-10 px-10 text-blue-100 dark:text-neutral-400 group-hover/feature:text-blue-300 transition-colors duration-200">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-blue-200 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-blue-100 dark:text-neutral-100 group-hover/feature:text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-blue-50 dark:text-neutral-300 max-w-xs relative z-10 px-10 group-hover/feature:text-blue-100 transition-colors duration-200">
        {description}
      </p>
      
      {isClickable && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-4 h-4 text-blue-300" />
        </div>
      )}
    </div>
  );
};
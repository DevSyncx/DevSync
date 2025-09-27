import React, { useContext } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import CardWrapper from "./CardWrapper";
import { Calendar } from "lucide-react";
import ThemeContext from "../ui/theme-provider.jsx";

export default function ActivityHeatmap({ className = "", activityData = [] }) {
  // Get current theme from context
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  
  // Theme specific colors
  const emptyColor = isDarkMode ? "#132237" : "#eeeeee";
  const borderColor = isDarkMode ? "#0c1524" : "#ffffff";
  const textColor = isDarkMode ? "#a3b8cc" : "#333333";
  const colors = isDarkMode 
    ? ["#1f3a5f", "#2d5c8a", "#3b82c4", "#5da9f6"] // Dark blues for dark mode
    : ["#97e3d5", "#61cdbb", "#e8c1a0", "#f47560"]; // Default colors for light mode
  
  return (
    <CardWrapper className={`p-4 ${className}`}>
      <div className="flex items-center mb-4">
        <Calendar size={20} className="text-[var(--primary)] mr-2" />
        <h3 className="text-lg font-semibold text-[var(--primary)]">
          Activity Heatmap
        </h3>
      </div>
      <div className="h-48 w-full">
        <ResponsiveCalendar
          data={activityData}
          from={`${new Date().getFullYear()-1}-01-01`}
          to={`${new Date().getFullYear()}-12-31`}
          emptyColor={emptyColor}
          colors={colors}
          margin={{ top: 20, right: 40, bottom: 0, left: 40 }}
          yearSpacing={40}
          monthBorderColor={borderColor}
          dayBorderWidth={2}
          dayBorderColor={borderColor}
          theme={{
            textColor: textColor,
            fontSize: 12,
            tooltip: {
              container: {
                background: isDarkMode ? '#1a2b47' : '#ffffff',
                color: isDarkMode ? '#a3b8cc' : '#333333',
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: isDarkMode ? '0 4px 10px rgba(0, 0, 0, 0.5)' : '0 4px 10px rgba(0, 0, 0, 0.15)'
              }
            }
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "row",
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: "right-to-left"
            }
          ]}
        />
      </div>
    </CardWrapper>
  );
}
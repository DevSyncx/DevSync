import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";

export default function ActivityHeatmap({
  activityData = [],
  className = "",
  onAddActivity,
}) {
  // Prepare data in {day: 'YYYY-MM-DD', value: n} format
  const data = activityData.map((date) => ({ day: date, value: 1 }));

  const handleClick = (day) => {
    if (onAddActivity) {
      onAddActivity(day); // parent will handle backend call & state update
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-center text-[var(--primary)]">
          Activity
        </h3>
      </CardHeader>
      <CardContent className="p-2 overflow-x-auto">
        <div className="min-w-[700px] h-64">
          <ResponsiveCalendar
            data={data}
            from="2025-01-01"
            to="2025-12-31"
            emptyColor="var(--calendar-empty)"
            colors={[
              "var(--calendar-level-1)",
              "var(--calendar-level-2)",
              "var(--calendar-level-3)",
              "var(--calendar-level-4)",
            ]}
            dayBorderWidth={2}
            dayBorderColor="var(--calendar-day-border)"
            monthBorderColor="var(--calendar-month-border)"
            margin={{ top: 10, right: 10, bottom: 10, left: 40 }}
            yearSpacing={40}
            onClick={(day) => handleClick(day)}
            legends={[
              {
                anchor: "bottom-right",
                direction: "row",
                translateY: 36,
                itemCount: 4,
                itemWidth: 34,
                itemHeight: 14,
                itemsSpacing: 4,
                itemDirection: "left-to-right",
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";

export default function ActivityHeatmap({ activityData, className = "" }) {
  return (
  <div className={`bg-[var(--card)] rounded-xl shadow p-4 w-full ${className}`}>
  <h3 className="text-lg font-semibold text-center text-[var(--primary)]">Activity</h3>
      <div className="h-64 min-h-[40px] w-full overflow-x-auto">
        <div className="min-w-[700px] h-full">
        <ResponsiveCalendar
          data={activityData}
          from="2025-01-01"
          to="2025-12-31"
          emptyColor="#eeeeee"
          colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
          margin={{ top: 10, right: 10, bottom: 10, left: 50 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
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
    </div>
</div>
  );
}

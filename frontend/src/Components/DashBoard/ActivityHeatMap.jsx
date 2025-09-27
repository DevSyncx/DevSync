import React, { useMemo, useEffect } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";

export default function ActivityHeatmap({ activityData = [], className = "" }) {
  // Debug log to check the data we're receiving
  useEffect(() => {
    console.log("ActivityHeatmap received data:", activityData);
  }, [activityData]);
  
  // Transform DevSync activity data for the heatmap
  const formattedActivityData = useMemo(() => {
    // Current year
    const currentYear = new Date().getFullYear();
    
    // Set a limit to only show the last 90 days of activity
    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - 90); // Only show last 90 days
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    console.log(`Limiting heatmap to show activity from ${cutoffDateStr} onwards`);
    
    // If no activity data, create some sample DevSync data
    if (!activityData || !Array.isArray(activityData) || activityData.length === 0) {
      console.log("No activity data to display, creating sample DevSync data");
      
      // Generate sample data - very sparse
      const sampleData = [];
      
      // Only add activity on specific days (not random)
      const activityDays = [1, 5, 8, 12, 18, 25, 30, 38, 45, 52, 60, 68, 75, 82];
      
      for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Only add activity for specific days
        if (activityDays.includes(i)) {
          sampleData.push({
            day: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * 3) + 1 // 1-3 activity value
          });
        }
      }
      
      console.log("Created sample DevSync activity data:", sampleData.length, "entries");
      return sampleData;
    }
    
    // Group by date and count events - limit to the cutoff date
    const activityByDate = {};
    
    // Process DevSync activity data - handle multiple possible formats
    activityData.forEach(activity => {
      if (!activity) return; // Skip null/undefined items
      
      // Try to extract the date from various possible properties
      let date = null;
      
      if (activity.day) {
        date = activity.day;
      } else if (activity.date) {
        date = activity.date;
      } else if (activity.timestamp) {
        date = new Date(activity.timestamp).toISOString().split('T')[0];
      }
      
      // Only include activity from after the cutoff date
      if (date && date >= cutoffDateStr) {
        if (!activityByDate[date]) {
          activityByDate[date] = 0;
        }
        // If the activity already has a value property, use it, otherwise default to 1
        const activityValue = Math.min(activity.value || 1, 4); // Cap at 4 for less intense colors
        activityByDate[date] += activityValue;
      }
    });
    
    // Format for the Nivo Calendar component
    const formattedData = Object.entries(activityByDate).map(([date, value]) => ({
      day: date,
      value
    }));
    
    console.log("Formatted activity data:", formattedData.length, "entries");
    return formattedData;
  }, [activityData]);
  
  // Get date range for calendar - only show 3 months
  const dateRange = useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    // Format dates for the calendar component
    const from = threeMonthsAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];
    
    console.log(`Setting heatmap date range: ${from} to ${to}`);
    
    return { from, to };
  }, []);

  // Check if we have data to display
  const hasData = formattedActivityData && formattedActivityData.length > 0;

  return (
    <div className={`bg-[var(--card)] rounded-xl shadow p-4 w-full ${className}`}>
      <h3 className="text-lg font-semibold text-center text-[var(--primary)]">Activity</h3>
      
      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
          <p>No activity data to display</p>
        </div>
      ) : (
        <div className="h-64 min-h-[40px] w-full overflow-x-auto">
          <div className="min-w-[700px] h-full">
            <ResponsiveCalendar
              data={formattedActivityData}
              from={dateRange.from}
              to={dateRange.to}
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
      )}
    </div>
  );
}

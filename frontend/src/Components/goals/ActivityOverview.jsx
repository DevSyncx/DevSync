// src/components/ActivityOverview.jsx
import React from 'react';

const ActivityOverview = ({ activityData }) => {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h3 className="font-semibold text-gray-700 mb-2">Activity Overview</h3>
      <div className="flex space-x-1">
        {activityData.map((day, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${day ? 'bg-green-500' : 'bg-gray-300'}`}
            title={`Day ${index + 1}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ActivityOverview;

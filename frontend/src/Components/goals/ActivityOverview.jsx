// src/components/ActivityOverview.jsx
import React from 'react';

const ActivityOverview = ({ activityData }) => {
  return (
    <div className='bg-[#1a2b47] shadow rounded p-4 mb-6'>
      <h3 className='font-bold text-shadow-white mb-2'>Activity Overview</h3>
      <div className='flex space-x-1'>
        {activityData.map((day, index) => (
          <div key={index} className={`w-4 h-4 rounded-full ${day ? 'bg-indigo-600' : 'bg-gray-400'}`} title={`Day ${index + 1}`}>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityOverview;

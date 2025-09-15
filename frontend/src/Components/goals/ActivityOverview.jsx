// src/components/ActivityOverview.jsx
import { color } from 'framer-motion';
import React from 'react';

const ActivityOverview = ({ activityData }) => {
  return (
    <div className='shadow rounded p-4 mb-6' style={{background:"var(--divColor)"}}>
      <h3 className='font-bold mb-2' style={{ color: "var(--progressText)" }}>Activity Overview</h3>
      <div className='flex space-x-1'>
        {activityData.map((day, index) => (
          <div key={index} className={`w-4 h-4 rounded-full ${day ? 'bg-indigo-800' : 'bg-gray-400'}`} title={`Day ${index + 1}`}>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityOverview;

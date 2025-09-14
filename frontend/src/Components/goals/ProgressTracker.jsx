// src/components/ProgressTracker.jsx
import React from 'react';

const ProgressTracker = ({ title, value, isProgressBar = false }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {isProgressBar ? (
        <div className="mt-2 bg-gray-200 rounded-full h-4">
          <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
      ) : (
        <p className="mt-2 text-2xl font-bold">{value}</p>
      )}
    </div>
  );
};

export default ProgressTracker;

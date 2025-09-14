// src/components/ProgressTracker.jsx

import React from 'react';

const ProgressTracker = ({ title, value, isProgress = false }) => {
  return (
    <div className='bg-[#1a2b47] shadow rounded p-4'>
      <h3 className="font-bold text-white">{title}</h3>
      {isProgress ? (
        <div className='mt-2 bg-white rounded-full h-4'>
          <div className='bg-indigo-500 h-4 rounded-full' style={{width: `${value}% `}}></div>
        </div> 
      ) : (
          <p className='mt-2 text-2xl font-bold'>{value}</p>
      )}
    </div>
  );
};



export default ProgressTracker;

// src/components/ProgressTracker.jsx

import React from 'react';
import './goals.css';

const ProgressTracker = ({ title, value, isProgress = false }) => {
  return (
    <div className='shadow rounded p-4' style={{background:"var(--divColor)"}}>
      <h3 className="font-bold" style={{ color: "var(--progressText)" }}>{title}</h3>
      {isProgress ? ( 
        <div className='mt-2 bg-white rounded-full h-4'>
          <div className='bg-indigo-500 h-4 rounded-full' style={{width: `${value}% `}}></div>
        </div> 
      ) : (
          <p className='mt-2 text-2xl font-bold' style={{ color: "var(--progressText)" }}>{value}</p>
      )}
    </div>
  );
};



export default ProgressTracker;

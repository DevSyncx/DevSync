// src/components/Challenge.jsx
import React from 'react';
import { useState } from 'react';

function complete() {
  setIsCompleted(true);
}

const Challenge = ({ challenge }) => {
  const { title, description, difficulty, points, status } = challenge;
  const [isCompleted, setIsCompleted] = useState(status === 'completed');
  const getBadgeColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-200 text-green-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'hard':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  function complete() {
    setIsCompleted(true);
  }

  return (
    <div className={`bg-[#1a2b47] shadow rounded p-4 mb-4 ${isCompleted ? 'opacity-60' : ''}`}>
      <h4 cladssName='font-bold text-white'>{title}</h4>
      <p className='font-bold text-shadow-white'>{description}</p>
      <div className='mt-2 flex items-center space-x-2'>
        <span className={`px-2 py-1 fold-bold text-xs rounded-full ${getBadgeColor()}`}> {difficulty}</span>
        <span className='px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800'>{points} pts</span>
      </div>
      <div className="mt-4">
        {isCompleted ? (
        <button className="px-4 py-2 bg-green-500 text-white rounded cursor-not-allowed"> Completed</button>
        ) : (
        <button onClick={complete} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Mark Complete</button>
        )}
      </div>
      </div>
    ) 
}

export default Challenge;

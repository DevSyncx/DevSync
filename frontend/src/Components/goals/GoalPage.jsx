// src/pages/GoalsPage.jsx
import React, { useState } from 'react';
import ProgressTracker from './ProgressTracker';
import ActivityOverview from './ActivityOverview.jsx';
import Challenge from './Challenge.jsx';
import { TracingBeam } from "../ui/tracing-beam";

const GoalPage = () => {
  // Example state for challenges and progress
  const [currentStreak, setCurrentStreak] = useState(7);
  const [bestStreak, setBestStreak] = useState(12);
  const [totalCompleted, setTotalCompleted] = useState(47);
  const [weeklyProgress, setWeeklyProgress] = useState(75);

  // Dummy data for activity overview and challenges
  const activityData = [1, 1, 0, 1, 1, 0, 1]; // 1 = active, 0 = inactive
  const todaysChallenges = [
    {
      id: 1,
      title: 'Code Review Champion',
      description: 'Review and provide feedback on 3 pull requests.',
      difficulty: 'medium',
      points: 150,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Documentation Warrior',
      description: 'Write or update documentation for your project.',
      difficulty: 'easy',
      points: 100,
      status: 'completed'
    }
  ];
  const weeklyChallenge = {
    id: 3,
    title: 'Testing Excellence',
    description: 'Write comprehensive tests for a new feature.',
    difficulty: 'hard',
    points: 300,
    status: 'not-started'
  };

  return (
    <TracingBeam className="px-4 md:px-10">
      <div className="goals-page p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">DevSync Challenges</h1>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ProgressTracker title="Current Streak" value={currentStreak} />
        <ProgressTracker title="Best Streak" value={bestStreak} />
        <ProgressTracker title="Total Completed" value={totalCompleted} />
        <ProgressTracker title="Weekly Progress" value={weeklyProgress} isProgressBar={true} />
      </div>

      {/* Activity Overview */}
      <ActivityOverview activityData={activityData} />

      {/* Today's Challenges */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Today's Challenges</h2>
        {todaysChallenges.map((challenge) => (
          <Challenge key={challenge.id} challenge={challenge} />
        ))}
      </div>

      {/* This Week's Challenge */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">This Week's Challenge</h2>
        <Challenge challenge={weeklyChallenge} />
      </div>
    </div>
    </TracingBeam>
    
  );
};

export default GoalPage;

// frontend/src/Components/Features.jsx
import React from 'react';
// Assuming the original content of your Features component is similar to this structure.
// If your Features component has different content, make sure to preserve it.

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Unified Dashboard</h3>
            <p className="text-gray-400">
              Track all your coding activity, tasks, and progress in one central place.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Real-time Sync</h3>
            <p className="text-gray-400">
              Effortlessly sync data from various platforms like GitHub, Jira, and more.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Insightful Analytics</h3>
            <p className="text-gray-400">
              Visualize your productivity trends and identify areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; // This line is crucial for fixing the import error

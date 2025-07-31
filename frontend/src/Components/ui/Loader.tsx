// frontend/src/Components/ui/Loader.tsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin-reverse"></div>
        <p className="absolute text-white text-lg font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading...</p>
      </div>
    </div>
  );
};

export default Loader; // This line is crucial for fixing the import error

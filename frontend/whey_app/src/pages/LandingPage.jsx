import React from 'react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-auto bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Analyze Your Whey Protein Instantly</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload ingredient lists or nutritional labels for instant analysis.
      </p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</button>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { Pie } from 'react-chartjs-2'; // Import the Pie component
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; // Import and register required Chart.js components

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsPage = () => {
  // Data for the Pie chart
  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Nutritional Breakdown',
        data: [70, 20, 10], // Example data
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
      <div className="mb-6">
        <Pie data={data} />
      </div>
      <p className="text-lg">
        This product has a high protein content with minimal fillers.
      </p>
    </div>
  );
};

export default ResultsPage;

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // For donut chart visualization
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setIsLoading(true); // Show loading state
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upload-label', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'File uploaded successfully!');
      setIngredients(response.data.final_ingredients || []);
      setAnalysis(response.data.analysis || {});
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        const errorMsg =
          error.response?.data?.error || 'An error occurred while uploading the file.';
        setMessage(errorMsg);
      }
       finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Data for the donut chart
  const chartData = analysis
    ? {
        labels: ['High Quality', 'Neutral', 'Fillers', 'Artificial', 'Unknown'],
        datasets: [
          {
            data: [
              analysis.high_quality || 0,
              analysis.neutral || 0,
              analysis.fillers || 0,
              analysis.artificial || 0,
              analysis.unknown || 0,
            ],
            backgroundColor: ['#4caf50', '#9e9e9e', '#f44336', '#ff9800', '#607d8b'],
          },
        ],
      }
    : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Nutritional Label</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 border rounded px-4 py-2 w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Analyze'}
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}

      {/* Results Section */}
      <div className="mt-6">
        {ingredients.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Extracted Ingredients</h2>
            <ul className="list-disc pl-6">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Analysis</h2>

            {/* Donut Chart Visualization */}
            {chartData && (
              <div className="max-w-md mx-auto mb-6">
                <Doughnut data={chartData} />
              </div>
            )}

            {/* Scoring Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold text-green-600">High Quality</h3>
                <p className="text-xl">{analysis.high_quality || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-600">Neutral</h3>
                <p className="text-xl">{analysis.neutral || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-600">Fillers</h3>
                <p className="text-xl">{analysis.fillers || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-600">Artificial</h3>
                <p className="text-xl">{analysis.artificial || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-400">Unknown</h3>
                <p className="text-xl">{analysis.unknown || 0}</p>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-blue-600">Overall Score</h3>
              <p className="text-2xl font-bold">{analysis.overall_score || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadingPage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

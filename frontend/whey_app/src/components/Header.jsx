import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Whey Analyzer</h1>
        <nav>
          <Link className="mx-2 hover:text-blue-400" to="/">Home</Link>
          <Link className="mx-2 hover:text-blue-400" to="/upload">Upload</Link>
          <Link className="mx-2 hover:text-blue-400" to="/results">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

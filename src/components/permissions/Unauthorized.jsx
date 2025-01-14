import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page. Please check your access level or contact the administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

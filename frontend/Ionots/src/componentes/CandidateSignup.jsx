import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_END_POINT_User } from '../utils/constants';

const CandidateSignup = () => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    candidateId: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // API call for signup
      await axios.post(`${API_END_POINT_User}/signup`, formData);
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000); // Redirect to login page
    } catch (err) {
      setMessage('Error: Unable to create an account. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-6">
            <h1 className="text-3xl font-extrabold text-white text-center">
              Candidate Signup
            </h1>
          </div>

          <div className="p-8 space-y-6">
            {message && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m2 4H7M5 8h14m-7 8v2m0-12v2"
                  />
                </svg>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Candidate Name */}
              <div>
                <label
                  htmlFor="candidateName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Candidate ID */}
              <div>
                <label
                  htmlFor="candidateId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Candidate ID
                </label>
                <input
                  type="text"
                  id="candidateId"
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Create a candidate ID"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/')}
                className="text-green-500 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignup;

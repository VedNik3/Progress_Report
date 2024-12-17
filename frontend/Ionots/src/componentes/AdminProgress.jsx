import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_END_POINT_User } from '../utils/constants';

const AdminProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidate progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_User}/progress`);
        setProgressData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress:', err);
        toast.error('Failed to fetch progress data');
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getProgressColor = (progress) => {
    const progressNum = parseFloat(progress);
    if (progressNum < 25) return { bg: 'bg-rose-500/20', text: 'text-rose-700' };
    if (progressNum < 50) return { bg: 'bg-amber-500/20', text: 'text-amber-700' };
    if (progressNum < 75) return { bg: 'bg-emerald-500/20', text: 'text-emerald-700' };
    return { bg: 'bg-blue-500/20', text: 'text-blue-700' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="container mx-auto max-w-7xl space-y-6">
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Header with Gradient and Subtle Hover Effect */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300">
            <h2 className="text-3xl font-extrabold tracking-tight">Candidates' Progress Dashboard</h2>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Loading State with Enhanced Animation */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-t-indigo-600 border-r-4 border-r-purple-500 border-b-4 border-b-blue-400 border-l-4 border-l-teal-300"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header with Enhanced Styling */}
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Candidate ID', 'Name', 'Total Tasks', 'Completed Tasks', 'Projects', 'Progress', 'Total Score'].map((header) => (
                      <th key={header} className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                {/* Table Body with Enhanced Interactions */}
                <tbody className="divide-y divide-slate-200">
                  {progressData.map((candidate, index) => {
                    const progressColors = getProgressColor(candidate.progress);
                    
                    return (
                      <tr 
                        key={index} 
                        className="hover:bg-slate-100/50 transition-all duration-200 ease-in-out group"
                      >
                        <td className="p-4 whitespace-nowrap text-sm text-slate-700 group-hover:text-indigo-700">{candidate.candidateId}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-slate-900 group-hover:text-indigo-800">{candidate.candidateName}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-slate-600">{candidate.totalTasks}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-slate-600">{candidate.completedTasks}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-slate-600">
                          {candidate.completedProjects}/{candidate.totalProjects}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2 overflow-hidden">
                              <div 
                                className={`h-full ${progressColors.bg}`}
                                style={{width: `${candidate.progress}%`}}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${progressColors.text}`}>
                              {candidate.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-slate-900 group-hover:text-indigo-800">
                          {candidate.totalScore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProgress;
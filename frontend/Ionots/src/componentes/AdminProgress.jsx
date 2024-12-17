import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidate progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/progress');
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
    if (progressNum < 25) return 'bg-red-200';
    if (progressNum < 50) return 'bg-yellow-200';
    if (progressNum < 75) return 'bg-green-200';
    return 'bg-emerald-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="bg-indigo-600 text-white p-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Candidates' Progress Dashboard</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {['Candidate ID', 'Name', 'Total Tasks', 'Completed Tasks', 'Projects', 'Progress', 'Total Score'].map((header) => (
                      <th key={header} className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {progressData.map((candidate, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    >
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700">{candidate.candidateId}</td>
                      <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.candidateName}</td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500">{candidate.totalTasks}</td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500">{candidate.completedTasks}</td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.completedProjects}/{candidate.totalProjects}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className={`w-full bg-gray-200 rounded-full h-2.5 mr-2 ${getProgressColor(candidate.progress)}`}
                            style={{width: `${candidate.progress}%`}}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{candidate.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {candidate.totalScore}
                      </td>
                    </tr>
                  ))}
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
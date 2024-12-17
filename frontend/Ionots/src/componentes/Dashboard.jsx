import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { API_END_POINT_User, API_END_POINT_Project } from '../utils/constants';

const Dashboard = () => {
  const { candidateId } = useParams();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_User}/candidate/${candidateId}`);
        setCandidateName(response.data.name);
      } catch (err) {
        console.error('Error fetching candidate data:', err);
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_Project}/assigned/${candidateId}`);
        setAssignedProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        toast.error('No projects assigned yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedProjects();
  }, [candidateId]);

  const calculateProgress = (createdDate, deadline) => {
    const now = new Date();
    const startDate = new Date(createdDate);
    const endDate = new Date(deadline);
    
    const totalDuration = (endDate - startDate) / (1000 * 3600 * 24);
    const elapsedTime = (now - startDate) / (1000 * 3600 * 24);
    
    const progress = Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);
    return progress;
  };

  const calculateDaysRemaining = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const remainingTime = dueDate - now;
    const daysRemaining = Math.ceil(remainingTime / (1000 * 3600 * 24));
    return daysRemaining;
  };

  const handleAcceptProject = async (projectId) => {
    try {
      await axios.post(`${API_END_POINT_Project}/accept/${projectId}`, { candidateId });
      toast.success('Project accepted and in progress!');
      setAssignedProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? { ...project, status: 'In Progress' } : project
        )
      );
    } catch (err) {
      toast.error('Error accepting project.');
    }
  };

  const handleTaskCompletionChange = async (projectId, taskId, isChecked) => {
    try {
      const response = await axios.post(`${API_END_POINT_Project}/task/update/${projectId}`, {
        taskId,
        isChecked,
      });

      const updatedProject = response.data;

      const totalTasks = updatedProject.tasks.length;
      const completedTasks = updatedProject.tasks.filter(task => task.completed).length;
      const newProgress = Math.round((completedTasks / totalTasks) * 100);

      if (newProgress === 100 && updatedProject.status !== 'Completed') {
        updatedProject.status = 'Completed';
        updatedProject.score = updatedProject.tasks.reduce((total, task) => total + (task.completed ? task.points : 0), 0);
      }

      setAssignedProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? { ...project, ...updatedProject, progress: newProgress } : project
        )
      );
    } catch (err) {
      toast.error('Error updating task completion.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-800 bg-white rounded-lg shadow-md py-4 px-6">
          Welcome to Your Dashboard, 
          <span className="text-blue-600 ml-2">{candidateName}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {assignedProjects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <p className="text-gray-500 text-xl">No projects assigned yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {assignedProjects.map((project) => {
                  const progress = calculateProgress(project.createdAt, project.deadline);
                  const daysRemaining = calculateDaysRemaining(project.deadline);

                  return (
                    <div 
                      key={project._id} 
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${project.status === 'Assigned' ? 'bg-blue-100 text-blue-800'
                              : project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800'
                              : project.status === 'Incomplete' ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{project.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Deadline: {new Date(project.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        {project.status !== 'Completed' && project.status !== 'Incomplete' && (
                          <div className="w-20 h-20">
                            <CircularProgressbar
                              value={progress}
                              maxValue={100}
                              text={`${daysRemaining} days left`}
                              styles={{
                                path: {
                                  stroke: progress === 100 ? '#10B981' : '#3B82F6', 
                                  strokeWidth: 8,
                                },
                                text: { 
                                  fontSize: '14px', 
                                  fill: '#1E40AF', 
                                  fontWeight: 'bold' 
                                },
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {project.status !== 'Completed' && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-800 font-semibold">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {project.status === 'Assigned' && (
                        <button
                          onClick={() => handleAcceptProject(project._id)}
                          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
                        >
                          Accept Project
                        </button>
                      )}

                      {project.status === 'In Progress' && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-700 mb-3">Tasks:</h3>
                          <div className="space-y-2">
                            {project.tasks.map((task) => (
                              <div 
                                key={task._id} 
                                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) =>
                                      handleTaskCompletionChange(project._id, task._id, e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    disabled={project.status === 'Incomplete'}
                                  />
                                  <span 
                                    className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                                  >
                                    {task.title} 
                                    <span className="text-xs text-gray-500 ml-2">({task.points} points)</span>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          Score: <span className="text-blue-600">{project.score ?? 'Not yet assigned'}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
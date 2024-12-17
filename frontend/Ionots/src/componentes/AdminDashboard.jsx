import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { API_END_POINT_User, API_END_POINT_Project } from '../utils/constants';

const AdminDashboard = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPoints, setTaskPoints] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch candidates when the component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_User}/candidates`);
        setCandidates(response.data);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        toast.error('Failed to fetch candidates');
      }
    };
    fetchCandidates();
  }, []);

  // Handle assigning the project with tasks
  const handleAssignProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_END_POINT_Project}/assign`, {
        projectTitle,
        projectDescription,
        candidateId,
        deadline,
        tasks,
      });
      
      toast.success('Project assigned successfully!');
      // Reset form fields
      setProjectTitle('');
      setProjectDescription('');
      setCandidateId('');
      setDeadline('');
      setTasks([]);
    } catch (err) {
      toast.error('Error assigning project.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a task to the project
  const handleAddTask = () => {
    if (!taskTitle || !taskPoints) {
      toast.error('Please provide both task title and points.');
      return;
    }
    setTasks([
      ...tasks,
      { title: taskTitle, points: parseInt(taskPoints), completed: false },
    ]);
    setTaskTitle('');
    setTaskPoints('');
  };

  // Remove a task from the list
  const handleRemoveTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header Section with "View Progress" button */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-white">
              Project Assignment
            </h1>
            <button
              onClick={() => navigate('/progress')}
              className="px-4 py-2 bg-blue-300 text-blue-900 font-semibold rounded-lg hover:bg-blue-400 transition duration-300"
            >
              View Progress
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleAssignProject} className="p-8 space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                required
                placeholder="Enter project title"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 h-24"
                required
                placeholder="Describe the project details"
              />
            </div>

            {/* Candidate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Candidate
              </label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate._id} value={candidate.candidateId}>
                    {candidate.candidateId} - {candidate.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Add Task Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Tasks</h2>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={taskPoints}
                  onChange={(e) => setTaskPoints(e.target.value)}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Task
                </button>
              </div>

              {/* Tasks List */}
              {tasks.length > 0 && (
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li
                      key={index}
                      className="flex justify-between bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{task.title} ({task.points} points)</span>
                      <button
                        onClick={() => handleRemoveTask(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-semibold rounded-lg ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Assigning...' : 'Assign Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

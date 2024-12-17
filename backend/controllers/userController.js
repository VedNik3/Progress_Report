import {User} from '../models/user.js';
import {Project} from '../models/project.js'

// Function to validate candidate ID
export const loginUser = async (req, res) => {
  const { candidateId } = req.body;

  try {
    // Find user by candidateId
    const user = await User.findOne({ candidateId });

    if (!user) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Send back user role and candidateId
    return res.status(200).json({
      message: 'Login successful',
      user: {
        candidateId: user.candidateId,
        role: user.role, // Either "admin" or "candidate"
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: 'candidate' }); // Only fetch candidates
    res.status(200).json(candidates); // Send list of candidates to the frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const candidate = await User.findOne({ candidateId });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signupCandidate = async (req, res) => {
  const { candidateName, email, candidateId } = req.body;

  // Check if all fields are provided
  if (!candidateName || !email || !candidateId) {
    res.status(400);
    throw new Error('Please provide all required fields: Name, Email, and Candidate ID');
  }

  // Check if the candidate ID or email already exists
  const userExists = await User.findOne({ $or: [{ email }, { candidateId }] });

  if (userExists) {
    res.status(400);
    throw new Error('User with this email or Candidate ID already exists');
  }

  // Create a new user
  const user = await User.create({
    name : candidateName,
    email,
    candidateId,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      candidateName: user.candidateName,
      email: user.email,
      candidateId: user.candidateId,
      role: user.role,
      message: 'Signup successful!',
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user');
  }
};

export const getCandidatesProgress = async (req, res) => {
  try {
    // Get all users with role 'candidate'
    const candidates = await User.find({ role: 'candidate' });

    // Prepare an array to store progress data for each candidate
    const progressData = [];

    // Loop through each candidate
    for (const candidate of candidates) {
      // Fetch projects assigned to the candidate
      const projects = await Project.find({ assignedTo: candidate.candidateId });

      // Initialize variables to calculate total tasks, completed tasks, total score, total projects, and completed projects
      let totalTasks = 0;
      let completedTasks = 0;
      let totalScore = 0;
      let totalProjects = 0;
      let completedProjects = 0;

      // Loop through each project to calculate tasks progress and score
      projects.forEach(project => {
        totalProjects++; // Increment total projects
        if (project.status === 'Completed') {
          completedProjects++; // Increment completed projects
        }

        totalTasks += project.tasks.length;
        
        project.tasks.forEach(task => {
          if (task.completed) {
            completedTasks++;
            totalScore += task.points; // Add task points if completed
          }
        });
      });

      // Calculate the overall progress as a percentage (0 to 100)
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Prepare the progress data for this candidate
      progressData.push({
        candidateId: candidate.candidateId,
        candidateName: candidate.name,
        totalTasks,
        completedTasks,
        progress: progress.toFixed(2),
        totalScore,
        totalProjects,
        completedProjects
      });
    }

    // Return the progress data
    res.status(200).json(progressData);
  } catch (err) {
    console.error('Error fetching candidate progress:', err);
    res.status(500).json({ message: 'Error fetching progress data' });
  }
};
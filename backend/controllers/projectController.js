import { Project } from '../models/project.js';
import cron from 'node-cron';

export const getAssignedProjects = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const projects = await Project.find({ assignedTo: candidateId });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects assigned to this candidate.' });
    }

    return res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

export const assignProject = async (req, res) => {
  const { projectTitle, projectDescription, candidateId, deadline, tasks } = req.body;

  try {
    // Create a new project entry in the database
    const newProject = new Project({
      title : projectTitle,
      description : projectDescription,
      assignedTo : candidateId,
      deadline,
      tasks,
    });

    // Save the new project to the database
    await newProject.save();

    // Return success response
    res.status(201).json({
      message: 'Project assigned successfully!',
      project: newProject,
    });
  } catch (err) {
    console.error('Error assigning project:', err);
    res.status(500).json({
      message: 'Error assigning project',
      error: err.message,
    });
  }
};

// In your project routes file
export const acceptProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { candidateId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.assignedTo !== candidateId) {
      return res.status(400).json({ message: 'This project is not assigned to the candidate' });
    }

    project.status = 'In Progress';
    await project.save();
    
    return res.status(200).json({ message: 'Project updated to In Progress' });
  } catch (err) {
    return res.status(500).json({ message: 'Error accepting project' });
  }
};

export const givingdailyupdates = async (req,res) => {
  try {
    const { projectId } = req.params;
    const { update } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Add the daily update
    project.dailyUpdates.push({ update });

    // Recalculate progress (this is just an example; you can implement your logic)
    project.progress = Math.min(project.progress + 10, 100);

    if (project.progress === 100) {
      project.status = 'Completed';
    }

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error adding update' });
  }
};

export const updateTaskCompletion = async (req, res) => {
  const { projectId } = req.params;
  const { taskId, isChecked } = req.body; // taskId and the completion status

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the task inside the project
    const task = project.tasks.find(t => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task completion status
    task.completed = isChecked;

    // Recalculate progress (percentage of completed tasks)
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    // Recalculate score (sum of points of completed tasks)
    const score = project.tasks
      .filter(t => t.completed)
      .reduce((total, t) => total + t.points, 0);

    // Update the project with the new progress and score
    project.progress = progress;
    project.score = score;

    if (progress === 100 && project.status !== 'Completed') {
      project.status = 'Completed';
    }
    // Save the updated project
    await project.save();

    // Send back the updated project data
    res.status(200).json({
      progress: project.progress,
      score: project.score,
      tasks: project.tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProjectStatusIfDeadlinePassed = async () => {
  try {
    const now = new Date();

    // Find all projects with a deadline before now and status is not 'Completed' or 'Incomplete'
    const projectsToUpdate = await Project.find({
      deadline: { $lt: now },
      status: { $nin: ['Completed', 'Incomplete'] },
    });

    // Update the status of all found projects
    projectsToUpdate.forEach(async (project) => {
      project.status = 'Incomplete';
      await project.save();
    });

    // console.log(`Updated ${projectsToUpdate.length} projects to 'Incomplete'`);
  } catch (err) {
    console.error('Error updating project status:', err);
  }
};

// Schedule a task to run once every day
// cron.schedule('* * * * * *', updateProjectStatusIfDeadlinePassed); // This runs at midnight every day
cron.schedule('0 0 * * *', updateProjectStatusIfDeadlinePassed); // This runs at midnight every day

// Call the function immediately on server start to check for already overdue projects
updateProjectStatusIfDeadlinePassed();
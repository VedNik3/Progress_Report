import express from "express";
import {assignProject, getAssignedProjects, acceptProject, updateTaskCompletion} from "../controllers/projectController.js"
const router = express.Router();

// Route to assign a project
router.get('/assigned/:candidateId', getAssignedProjects);
router.post('/assign', assignProject);
router.post('/accept/:projectId', acceptProject);
// router.post('/update/:projectId', givingdailyupdates);
router.post('/task/update/:projectId', updateTaskCompletion);
// router.post('/task/status/:projectId', updateProjectStatusIfDeadlinePassed);


// Accept a project
// router.post('/accept/:projectId', acceptProject);

// Route to fetch all projects for a candidate
// router.get('/:candidateId', getProjects);

export default router;

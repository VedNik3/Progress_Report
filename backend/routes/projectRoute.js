import express from "express";
import {assignProject, getAssignedProjects, acceptProject, updateTaskCompletion} from "../controllers/projectController.js"
const router = express.Router();

router.get('/assigned/:candidateId', getAssignedProjects);
router.post('/assign', assignProject);
router.post('/accept/:projectId', acceptProject);
router.post('/task/update/:projectId', updateTaskCompletion);

export default router;

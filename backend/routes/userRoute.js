import express from "express";
import { loginUser, getCandidates, getCandidateById, signupCandidate, getCandidatesProgress } from '../controllers/userController.js';
const router = express.Router();


router.post('/login', loginUser);
router.get('/candidates', getCandidates);
router.get('/candidate/:candidateId', getCandidateById)
router.post('/signup', signupCandidate);
router.get('/progress', getCandidatesProgress)

export default router;
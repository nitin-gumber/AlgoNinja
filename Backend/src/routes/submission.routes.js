import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {
  getAllUserSubmissions,
  getSubmissionForProblem,
  getTotalSubmissionsForProblem,
} from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get('/get-all-user-submissions', isAuthenticated, getAllUserSubmissions);
submissionRoutes.get(
  '/get-user-submissions-for-problem/:problemId',
  isAuthenticated,
  getSubmissionForProblem,
);
submissionRoutes.get(
  '/get-total-submissions-for-problem/:problemId',
  isAuthenticated,
  getTotalSubmissionsForProblem,
);

export default submissionRoutes;

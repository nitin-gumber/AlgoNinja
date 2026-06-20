import express from 'express';

import { createProblemValidator, updateProblemValidator } from '../validators/validate.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
  getUserSolvedProblemsCount,
} from '../controllers/problem.controller.js';

const problemRoutes = express.Router();

problemRoutes.post(
  '/createProblem',
  createProblemValidator(),
  handleValidationErrors,
  isAuthenticated,
  checkAdmin,
  createProblem,
);

problemRoutes.get('/getAllProblems', isAuthenticated, getAllProblems);

problemRoutes.get('/getProblem/:id', isAuthenticated, getProblemById);

problemRoutes.put(
  '/updateProblem/:id',
  updateProblemValidator(),
  handleValidationErrors,
  isAuthenticated,
  checkAdmin,
  updateProblem,
);

problemRoutes.delete('/deleteProblem/:id', isAuthenticated, checkAdmin, deleteProblem);

problemRoutes.get('/getAllProblemsSolvedByUser', isAuthenticated, getAllProblemsSolvedByUser);

problemRoutes.get('/get-user-solved-count', isAuthenticated, getUserSolvedProblemsCount);

export default problemRoutes;

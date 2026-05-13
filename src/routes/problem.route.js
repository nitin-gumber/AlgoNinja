import express from 'express';

import { createProblemValidator } from '../validators/validate.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import { createProblem, getAllProblems } from '../controllers/problem.controller.js';

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

export default problemRoutes;

import express from 'express';

import { createProblemValidator } from '../validators/validate.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated, checkAdmin } from '../middlewares/auth.middleware.js';
import { createProblem } from '../controllers/problem.controller.js';

const problemRoutes = express.Router();

problemRoutes.post(
  '/createProblem',
  createProblemValidator(),
  handleValidationErrors,
  isAuthenticated,
  checkAdmin,
  createProblem,
);

export default problemRoutes;

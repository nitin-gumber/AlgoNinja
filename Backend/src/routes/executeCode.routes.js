import express from 'express';
import { runCode, submitCode } from '../controllers/executeCode.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { submitCodeValidator } from '../validators/validate.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';

const executeCodeRoutes = express.Router();

executeCodeRoutes.post(
  '/run',
  submitCodeValidator(),
  handleValidationErrors,
  isAuthenticated,
  runCode,
);
executeCodeRoutes.post(
  '/submit',
  submitCodeValidator(),
  handleValidationErrors,
  isAuthenticated,
  submitCode,
);

export default executeCodeRoutes;

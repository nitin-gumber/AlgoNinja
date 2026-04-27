import express from 'express';
import { userRegisterValidator } from '../validators/validate.js';
import { register } from '../controllers/auth.controller.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', userRegisterValidator(), handleValidationErrors, register);

export default authRoutes;

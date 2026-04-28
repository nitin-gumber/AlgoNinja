import express from 'express';
import { userRegisterValidator, userLoginValidator } from '../validators/validate.js';
import { register, verifyUser, login } from '../controllers/auth.controller.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', userRegisterValidator(), handleValidationErrors, register);
authRoutes.get('/verifyUser/:verificationToken', verifyUser);
authRoutes.post('/login', userLoginValidator(), handleValidationErrors, login);

export default authRoutes;

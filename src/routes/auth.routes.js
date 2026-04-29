import express from 'express';
import { userRegisterValidator, userLoginValidator } from '../validators/validate.js';
import { register, verifyUser, login, checkUserProfile } from '../controllers/auth.controller.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', userRegisterValidator(), handleValidationErrors, register);
authRoutes.get('/verifyUser/:verificationToken', verifyUser);
authRoutes.post('/login', userLoginValidator(), handleValidationErrors, login);
authRoutes.get('/userProfile', isAuthenticated, checkUserProfile); // for testing perpose only, can be removed later

export default authRoutes;

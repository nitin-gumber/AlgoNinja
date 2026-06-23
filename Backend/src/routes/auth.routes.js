import express from 'express';
import passport from 'passport';
import {
  userRegisterValidator,
  userLoginValidator,
  userforgotPasswordValidator,
  userresetPasswordValidator,
} from '../validators/validate.js';
import {
  register,
  verifyUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  check,
  googleCallback,
} from '../controllers/auth.controller.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', userRegisterValidator(), handleValidationErrors, register);
authRoutes.get('/verifyUser/:verificationToken', verifyUser);
authRoutes.post('/login', userLoginValidator(), handleValidationErrors, login);
authRoutes.get('/check', isAuthenticated, check);
authRoutes.get('/logout', isAuthenticated, logout);

authRoutes.post(
  '/forgotPassword',
  userforgotPasswordValidator(),
  handleValidationErrors,
  forgotPassword,
);
authRoutes.post(
  '/resetPassword/:resetPasswordToken',
  userresetPasswordValidator(),
  handleValidationErrors,
  resetPassword,
);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    session: false,
  }),
  googleCallback,
);

export default authRoutes;

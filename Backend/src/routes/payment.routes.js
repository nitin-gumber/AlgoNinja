import express from 'express';
import { createOrder } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const paymentRoutes = express.Router()

paymentRoutes.post('/create-order', isAuthenticated, createOrder);

export default paymentRoutes;
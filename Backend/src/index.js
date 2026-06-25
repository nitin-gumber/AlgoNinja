import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from "cors"
import { connectDB } from './utils/dbConnect.js';

import userAuthRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.route.js';
import executeCodeRoutes from './routes/executeCode.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import sheetRoutes from './routes/sheet.routes.js';
import paymentRoutes from './routes/payment.routes.js';

import { configurePassport } from './utils/passport.js';
configurePassport();

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend origin
  credentials: true,               // Allow cookies/authorization headers if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configurePassport();
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Hi, Welocome to AlgoNinja 🔥');
});

app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/execute-code', executeCodeRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/sheets', sheetRoutes);
app.use('/api/v1/payments', paymentRoutes);
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Failed to Connecting MongoDB and Server');
    console.error(error);
  }
})();

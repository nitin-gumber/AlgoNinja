import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/dbConnect.js';

import userAuthRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hi, Welocome to AlgoNinja 🔥');
});

app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/problems', problemRoutes);

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

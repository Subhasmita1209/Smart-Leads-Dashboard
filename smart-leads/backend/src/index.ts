import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

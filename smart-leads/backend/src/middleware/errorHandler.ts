import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

 
  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists';
  }


  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation Error';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  console.error(`[${new Date().toISOString()}] Error:`, err);
  sendError(res, message, statusCode);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};

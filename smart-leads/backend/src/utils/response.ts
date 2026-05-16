import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta
): void => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string>
): void => {
  const response: ApiResponse<null> = { success: false, message };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
};

export const generateToken = (id: string, role: string): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

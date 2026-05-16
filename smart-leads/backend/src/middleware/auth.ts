import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendError } from '../utils/response';
import { UserRole } from '../types';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'Not authorized, no token provided', 401);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      sendError(res, 'User no longer exists', 401);
      return;
    }

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch {
    sendError(res, 'Not authorized, invalid token', 401);
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'You do not have permission to perform this action', 403);
      return;
    }
    next();
  };
};

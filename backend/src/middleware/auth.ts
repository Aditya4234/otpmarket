import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import User from '@/models/User';
import { AuthRequest } from '@/types';
import { env } from '@/config/env';
import { UnauthorizedResponse, ForbiddenResponse } from '@/utils/apiResponse';
import { asyncHandler } from '@/utils/asyncHandler';

export const authenticate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token as string;
  }

  if (!token) {
    return new UnauthorizedResponse('Please login to access this resource').send(res);
  }

  let decoded: JwtPayload & { _id: string; role: string };
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & { _id: string; role: string };
  } catch {
    return new UnauthorizedResponse('Invalid or expired token').send(res);
  }

  const user = await User.findById(decoded._id).select('-password');

  if (!user || !user.isActive) {
    return new UnauthorizedResponse('User not found or account is deactivated').send(res);
  }

  req.user = {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  next();
});

export const authorize = (...roles: ('user' | 'agent' | 'admin')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return new ForbiddenResponse('You do not have permission to perform this action').send(res);
    }
    next();
  };
};

export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user?._id);

  if (!user?.isVerified) {
    return new ForbiddenResponse('Please verify your email to access this resource').send(res);
  }

  next();
});

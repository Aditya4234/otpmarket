import { Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  CreatedResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  NotFoundResponse,
  ConflictResponse,
} from '@/utils/apiResponse';
import { env, isProduction } from '@/config/env';
import { generateOTP } from '@/utils/helpers';
import { sendEmail } from '@/services/email.service';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' as const : 'lax' as const,
  path: '/',
};

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return new ConflictResponse('An account with this email already exists').send(res);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
  });

  await Wallet.create({ user: user._id });

  const otp = generateOTP(6);
  user.otp = parseInt(otp, 10);
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  if (env.NODE_ENV === 'development') {
    console.log(`[DEV] OTP for ${user.email}: ${otp}`);
  } else {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your OTP Marketplace account',
        html: `
          <h1>Welcome to OTP Marketplace!</h1>
          <p>Your email verification OTP is:</p>
          <h2 style="letter-spacing: 4px; font-size: 28px; background: #f3f4f6; padding: 12px 24px; text-align: center; border-radius: 8px;">${otp}</h2>
          <p>This OTP expires in 10 minutes.</p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userData = user.toObject();
  const { password: _, ...userWithoutPassword } = userData;

  return new CreatedResponse('Account created successfully. Please verify your email.', {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }).send(res);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return new UnauthorizedResponse('Invalid email or password').send(res);
  }

  if (!user.isActive) {
    return new UnauthorizedResponse('Your account has been deactivated. Please contact support.').send(res);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return new UnauthorizedResponse('Invalid email or password').send(res);
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userData = user.toObject();
  const { password: _, ...userWithoutPassword } = userData;

  return new SuccessResponse('Login successful', {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }).send(res);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?._id) {
    const user = await User.findById(req.user._id).select('+refreshToken');
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }

  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });

  return new SuccessResponse('Logged out successfully').send(res);
});

export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    return new UnauthorizedResponse('Refresh token is required').send(res);
  }

  let decoded: { _id: string; role: string };
  try {
    decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET) as { _id: string; role: string };
  } catch {
    return new UnauthorizedResponse('Invalid or expired refresh token').send(res);
  }

  const user = await User.findById(decoded._id).select('+refreshToken');
  if (!user || !user.refreshToken || user.refreshToken !== incomingRefreshToken) {
    return new UnauthorizedResponse('Refresh token is no longer valid').send(res);
  }

  const accessToken = user.generateAuthToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return new SuccessResponse('Token refreshed successfully', {
    accessToken,
    refreshToken: newRefreshToken,
  }).send(res);
});

export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { otp } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  if (user.isVerified) {
    return new BadRequestResponse('Email is already verified').send(res);
  }

  if (!user.otp || !user.otpExpiry) {
    return new BadRequestResponse('No OTP has been generated. Please request a new one.').send(res);
  }

  if (user.otp.toString() !== otp.toString()) {
    return new BadRequestResponse('Invalid OTP').send(res);
  }

  if (new Date() > user.otpExpiry) {
    return new BadRequestResponse('OTP has expired. Please request a new one.').send(res);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return new SuccessResponse('Email verified successfully').send(res);
});

export const resendOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  if (user.isVerified) {
    return new BadRequestResponse('Email is already verified').send(res);
  }

  const otp = generateOTP(6);
  user.otp = parseInt(otp, 10);
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  if (env.NODE_ENV === 'development') {
    console.log(`[DEV] New OTP for ${user.email}: ${otp}`);
  } else {
    try {
      await sendEmail({
        to: user.email,
        subject: 'New OTP for email verification',
        html: `
          <h1>Email Verification</h1>
          <p>Your new OTP is:</p>
          <h2 style="letter-spacing: 4px; font-size: 28px; background: #f3f4f6; padding: 12px 24px; text-align: center; border-radius: 8px;">${otp}</h2>
          <p>This OTP expires in 10 minutes.</p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }
  }

  return new SuccessResponse('OTP resent successfully').send(res);
});

export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return new SuccessResponse('If an account with that email exists, a reset link has been sent.').send(res);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  if (env.NODE_ENV === 'development') {
    console.log(`[DEV] Password reset link for ${user.email}: ${resetUrl}`);
  } else {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send password reset email:', emailErr);
    }
  }

  return new SuccessResponse('If an account with that email exists, a reset link has been sent.').send(res);
});

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!user) {
    return new BadRequestResponse('Invalid or expired reset token').send(res);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.refreshToken = undefined;
  await user.save();

  return new SuccessResponse('Password reset successfully. Please login with your new password.').send(res);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id).select('+password');
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return new BadRequestResponse('Current password is incorrect').send(res);
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });

  return new SuccessResponse('Password changed successfully. Please login again.').send(res);
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return new NotFoundResponse('User not found').send(res);
  }

  const wallet = await Wallet.findOne({ user: user._id });

  return new SuccessResponse('Profile fetched successfully', {
    user,
    wallet,
  }).send(res);
});

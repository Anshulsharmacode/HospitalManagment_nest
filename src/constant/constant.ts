import jwt from 'jsonwebtoken';
import { UserRole } from 'src/db/entity/user.entity';

interface TokenPayload {
  userId?: string;
  email?: string;
  role?: UserRole;
}

export interface GeneratedOtp {
  otp: string;
  expiresAt: Date;
}

export function generateToken(data: TokenPayload): string {
  const secret = process.env.JWT_SECRET || 'defaultSecret';
  const token = jwt.sign(data, secret, { expiresIn: '1h' });

  return token;
}

export function generateOTP(): GeneratedOtp {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  return { otp, expiresAt };
}

export function verifyOTP(inputOtp, storedOtp, expiresAt) {
  if (Date.now() > expiresAt) {
    return false; // OTP expired
  }
  return inputOtp === storedOtp;
}

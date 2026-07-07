import { UserRole, UserStatus, UserLocation } from "./user.type";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  location: UserLocation;
  phone?: string;
  avatar?: string;
  assignedSites: string[]; // Site IDs
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
  createdBy?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface OTPData {
  otp: string;
  email: string;
}

export interface UpdatePasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  data?: any;
}

export type AuthError = {
  field?: string;
  message: string;
};

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

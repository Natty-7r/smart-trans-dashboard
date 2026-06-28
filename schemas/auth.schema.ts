import { z } from "zod";

// Sign-in schema
export const signInSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

// Forgot password (email) schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// OTP verification schema
export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export type OTPSchema = z.infer<typeof otpSchema>;

// Update password schema
export const updatePasswordSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

// Combined auth form types
export type AuthFormState = {
    success: boolean;
    message?: string;
    errors?: {
        field?: string;
        message: string;
    }[];
    data?: any;
};
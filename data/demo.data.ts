import { User } from "@/types/auth.type";

// Demo users for authentication
export const DEMO_USERS: User[] = [
    {
        id: "user-001",
        email: "admin@safaricom.com",
        name: "John Admin",
        role: "admin",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: "user-002",
        email: "noc@safaricom.com",
        name: "Sarah NOC",
        role: "noc_operator",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: "user-003",
        email: "engineer@safaricom.com",
        name: "Mike Field",
        role: "field_engineer",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: "user-004",
        email: "manager@safaricom.com",
        name: "Lisa Manager",
        role: "manager",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
];

// Demo passwords (in real app, these would be hashed)
// For demo: all passwords are "password123"
export const DEMO_PASSWORDS: Record<string, string> = {
    "admin@safaricom.com": "password123",
    "noc@safaricom.com": "password123",
    "engineer@safaricom.com": "password123",
    "manager@safaricom.com": "password123",
};

// Demo OTP storage (in real app, this would be in a database with TTL)
export const DEMO_OTP_STORE: Record<string, { otp: string; expiresAt: string }> = {};

// Helper: Find user by email
export const findUserByEmail = (email: string): User | undefined => {
    return DEMO_USERS.find((user) => user.email === email);
};

// Helper: Validate password
export const validatePassword = (email: string, password: string): boolean => {
    return DEMO_PASSWORDS[email] === password;
};

// Helper: Generate OTP (6 digits)
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Store OTP
export const storeOTP = (email: string, otp: string): void => {
    DEMO_OTP_STORE[email] = {
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    };
};

// Helper: Verify OTP
export const verifyOTP = (email: string, otp: string): boolean => {
    const record = DEMO_OTP_STORE[email];
    if (!record) return false;
    if (record.otp !== otp) return false;
    if (new Date(record.expiresAt) < new Date()) return false;
    return true;
};

// Helper: Clear OTP
export const clearOTP = (email: string): void => {
    delete DEMO_OTP_STORE[email];
};
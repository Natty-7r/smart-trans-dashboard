"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    signInSchema,
    forgotPasswordSchema,
    otpSchema,
    updatePasswordSchema,
} from "../../schemas/auth.schema";
import {
    DEMO_USERS,
    DEMO_PASSWORDS,
    findUserByEmail,
    validatePassword,
    generateOTP,
    storeOTP,
    verifyOTP,
    clearOTP,
} from "@/data/demo.data";
import { AuthResponse, AuthError, Session, User } from "@/types/auth.type";

// ============================================================
// SIGN IN
// ============================================================

export async function signInAction(
    prevState: AuthResponse | null,
    formData: FormData
): Promise<AuthResponse> {
    // 1. Extract form data
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    // 2. Validate with Zod
    const validated = signInSchema.safeParse(rawData);

    if (!validated.success) {
        // FIX: Use 'issues' instead of 'errors'
        const errors = validated.error.issues.map((err) => ({
            field: err.path[0] as string || "unknown",
            message: err.message,
        }));
        return {
            success: false,
            message: "Validation failed",
            data: { errors },
        };
    }

    const { email, password } = validated.data;

    // 3. Check if user exists
    const user = findUserByEmail(email);
    if (!user) {
        return {
            success: false,
            message: "Invalid email or password",
        };
    }

    // 4. Validate password
    if (!validatePassword(email, password)) {
        return {
            success: false,
            message: "Invalid email or password",
        };
    }

    // 5. Create session (in real app, this would use JWT)
    const session: Session = {
        user,
        token: `demo-token-${user.id}-${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    // 6. Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
    });

    // 7. Return success
    return {
        success: true,
        message: "Sign in successful!",
        user,
        token: session.token,
    };
}

// ============================================================
// FORGOT PASSWORD — Send OTP
// ============================================================

export async function forgotPasswordAction(
    prevState: AuthResponse | null,
    formData: FormData
): Promise<AuthResponse> {
    // 1. Extract form data
    const email = formData.get("email") as string;

    // 2. Validate
    const validated = forgotPasswordSchema.safeParse({ email });

    if (!validated.success) {
        // FIX: Use 'issues' instead of 'errors'
        const errors = validated.error.issues.map((err) => ({
            field: err.path[0] as string || "email",
            message: err.message,
        }));
        return {
            success: false,
            message: "Validation failed",
            data: { errors },
        };
    }

    // 3. Check if user exists
    const user = findUserByEmail(email);
    if (!user) {
        return {
            success: false,
            message: "No account found with this email address",
        };
    }

    // 4. Generate and store OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    // 5. In real app, send OTP via email/SMS
    console.log(`[DEMO] OTP for ${email}: ${otp}`);

    // 6. Return success with email (for OTP page)
    return {
        success: true,
        message: "OTP sent to your email",
        data: { email, otpSent: true },
    };
}

// ============================================================
// VERIFY OTP
// ============================================================

export async function verifyOTPAction(
    prevState: AuthResponse | null,
    formData: FormData
): Promise<AuthResponse> {
    // 1. Extract form data
    const otp = formData.get("otp") as string;
    const email = formData.get("email") as string;

    // 2. Validate
    const validated = otpSchema.safeParse({ otp });

    if (!validated.success) {
        // FIX: Use 'issues' instead of 'errors'
        const errors = validated.error.issues.map((err) => ({
            field: err.path[0] as string || "otp",
            message: err.message,
        }));
        return {
            success: false,
            message: "Validation failed",
            data: { errors },
        };
    }

    // 3. Verify OTP
    if (!verifyOTP(email, otp)) {
        return {
            success: false,
            message: "Invalid or expired OTP. Please request a new one.",
        };
    }

    // 4. Return success (redirect to update password)
    return {
        success: true,
        message: "OTP verified successfully",
        data: { email, otpVerified: true },
    };
}

// ============================================================
// UPDATE PASSWORD
// ============================================================

export async function updatePasswordAction(
    prevState: AuthResponse | null,
    formData: FormData
): Promise<AuthResponse> {
    // 1. Extract form data
    const rawData = {
        email: formData.get("email") as string,
        otp: formData.get("otp") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    // 2. Validate
    const validated = updatePasswordSchema.safeParse(rawData);

    if (!validated.success) {
        // FIX: Use 'issues' instead of 'errors'
        const errors = validated.error.issues.map((err) => ({
            field: err.path[0] as string || "unknown",
            message: err.message,
        }));
        return {
            success: false,
            message: "Validation failed",
            data: { errors },
        };
    }

    const { email, otp, newPassword } = validated.data;

    // 3. Verify OTP again
    if (!verifyOTP(email, otp)) {
        return {
            success: false,
            message: "Invalid or expired OTP. Please restart the process.",
        };
    }

    // 4. Update password (in real app, hash and save to database)
    // For demo: update in memory
    DEMO_PASSWORDS[email] = newPassword;

    // 5. Clear OTP
    clearOTP(email);

    // 6. Return success
    return {
        success: true,
        message: "Password updated successfully! Please sign in.",
        data: { passwordUpdated: true },
    };
}

// ============================================================
// SIGN OUT
// ============================================================

export async function signOutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/auth/signin");
}

// ============================================================
// GET CURRENT SESSION
// ============================================================

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        return null;
    }

    try {
        const session = JSON.parse(sessionCookie.value) as Session;
        // Check if expired
        if (new Date(session.expiresAt) < new Date()) {
            cookieStore.delete("session");
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

// ============================================================
// CHECK AUTH STATUS
// ============================================================

export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    return session?.user || null;
}
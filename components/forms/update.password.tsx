"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePasswordAction } from "@/lib/actions/auth.action";
import { toast } from "sonner";

export function UpdatePasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        label: string;
        color: string;
    }>({ score: 0, label: "Weak", color: "bg-red-500" });
    const [state, formAction, isPending] = useActionState(updatePasswordAction, null);

    // Get email and OTP from session storage
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            router.push("/auth/forgot-password");
        }

        // Try to get OTP from session (if stored during verification)
        const storedOtp = sessionStorage.getItem("resetOTP");
        if (storedOtp) {
            setOtp(storedOtp);
        }
    }, [router]);

    // If password updated successfully
    if (state?.success && state?.data?.passwordUpdated) {
        toast.success(state.message || "Password updated successfully!");
        // Clear session storage
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetOTP");
        router.push("/auth/signin");
        return null;
    }

    // If there are errors, show toast
    if (state?.success === false && state?.message) {
        toast.error(state.message);
    }

    // Check password strength
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
        const colors = [
            "bg-red-500",
            "bg-red-400",
            "bg-yellow-500",
            "bg-yellow-400",
            "bg-green-400",
            "bg-green-500",
        ];

        setPasswordStrength({
            score,
            label: labels[Math.min(score, 5)],
            color: colors[Math.min(score, 5)],
        });
    };

    if (!email) {
        return (
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 text-center">
                    <p>Loading...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <div className="flex items-center justify-center">
                    <div className="rounded-full bg-emerald-50 p-3 dark:bg-emerald-950">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your new password below
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    For: <span className="font-medium text-slate-600 dark:text-slate-300">{email}</span>
                </p>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {/* Hidden fields */}
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="otp" value={otp} />

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="h-11 pr-10"
                                onChange={(e) => checkPasswordStrength(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                disabled={isPending}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Password strength bar */}
                        <div className="space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                    className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400">
                                    Strength: <span className="font-medium">{passwordStrength.label}</span>
                                </span>
                                <span className="text-slate-400 dark:text-slate-500">
                                    {passwordStrength.score}/6
                                </span>
                            </div>
                        </div>

                        {state?.data?.errors?.find((e: any) => e.field === "newPassword") && (
                            <p className="text-sm text-red-500">
                                {state.data.errors.find((e: any) => e.field === "newPassword").message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="h-11 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                disabled={isPending}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {state?.data?.errors?.find((e: any) => e.field === "confirmPassword") && (
                            <p className="text-sm text-red-500">
                                {state.data.errors.find((e: any) => e.field === "confirmPassword").message}
                            </p>
                        )}
                    </div>

                    {/* Password requirements */}
                    <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <p className="font-medium">Password requirements:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4">
                            <li>At least 6 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                        </ul>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating password...
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </Button>

                    {/* Back to sign in */}
                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
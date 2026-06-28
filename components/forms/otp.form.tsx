"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordAction, verifyOTPAction } from "@/lib/actions/auth.action";
import { toast } from "sonner";

interface OTPFormProps {
    email?: string;
}

export function OTPForm({ email: propEmail }: OTPFormProps) {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [email, setEmail] = useState<string>(propEmail || "");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [state, formAction, isPending] = useActionState(verifyOTPAction, null);

    // Get email from session storage if not provided as prop
    useEffect(() => {
        if (!email) {
            const storedEmail = sessionStorage.getItem("resetEmail");
            if (storedEmail) {
                setEmail(storedEmail);
            } else {
                // No email, redirect back to forgot password
                router.push("/auth/forgot-password");
            }
        }
    }, [email, router]);

    // Handle OTP input change
    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const digits = pasted.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
            newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        // Focus last filled input
        const lastIndex = Math.min(digits.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    // Submit OTP
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        }
        if (!email) {
            toast.error("Email not found. Please restart the process.");
            return;
        }

        const formData = new FormData();
        formData.append("otp", otpString);
        formData.append("email", email);

        const result = await verifyOTPAction(null, formData);

        if (result.success) {
            toast.success(result.message || "OTP verified!");
            // Store email for update password
            sessionStorage.setItem("resetEmail", email);
            router.push("/auth/update-password");
        } else {
            toast.error(result.message || "Invalid OTP. Please try again.");
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        }
    };

    // If verification successful (handled above)
    // If there are errors, show toast (handled above)

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
                        <span className="text-xl font-bold text-emerald-600">📱</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                        {email}
                    </span>
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="h-14 w-14 rounded-lg border border-slate-200 text-center text-2xl font-bold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                                disabled={isPending}
                                autoFocus={index === 0}
                                aria-label={`OTP digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    {state?.success === false && state?.message && (
                        <p className="text-center text-sm text-red-500">{state.message}</p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                        disabled={isPending || otp.some((d) => !d)}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>

                    {/* Resend OTP */}
                    <div className="text-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Didn't receive the code?{" "}
                        </span>
                        <button
                            type="button"
                            className="text-emerald-600 hover:underline dark:text-emerald-400"
                            onClick={async () => {
                                // Resend OTP
                                const formData = new FormData();
                                formData.append("email", email);
                                const result = await forgotPasswordAction(null, formData);
                                if (result.success) {
                                    toast.success("OTP resent to your email!");
                                } else {
                                    toast.error(result.message || "Failed to resend OTP");
                                }
                                setOtp(Array(6).fill(""));
                                inputRefs.current[0]?.focus();
                            }}
                        >
                            Resend OTP
                        </button>
                    </div>

                    {/* Back */}
                    <div className="text-center">
                        <Link
                            href="/auth/forgot-password"
                            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to email
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/lib/actions/auth.action";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";

export function EmailForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

    // If OTP sent successfully, redirect to OTP page with email
    if (state?.success && state?.data?.email) {
        toast.success(state.message || "OTP sent to your email!");
        sessionStorage.setItem("resetEmail", state.data.email);
        router.push("/auth/forgot-password-otp");
        return null;
    }

    // If there are errors, show toast
    if (state?.success === false && state?.message) {
        toast.error(state.message);
    }

    return (
        <Card className="w-full max-w-md shadow-lg p-16">
            <CardHeader className="space-y-4 text-center">
                <div className="flex items-center justify-center">
                    <div className="rounded-full bg-emerald-50 p-3 dark:bg-emerald-950">
                        <Mail className="h-6 w-6 text-emerald-600" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your email address and we'll send you an OTP to reset your password
                </p>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={isPending}
                            className="h-11"
                            defaultValue={state?.data?.email || ""}
                        />
                        {state?.data?.errors?.find((e: any) => e.field === "email") && (
                            <p className="text-sm text-red-500">
                                {state.data.errors.find((e: any) => e.field === "email").message}
                            </p>
                        )}
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
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>

                    {/* Back to sign in */}
                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
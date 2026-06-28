"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInAction } from "@/lib/actions/auth.action";
import { Logo } from "@/components/common/logo";
import { toast } from "sonner";

export function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(signInAction, null);

    // If sign in successful, redirect to dashboard
    if (state?.success) {
        toast.success(state.message || "Signed in successfully!");
        router.push("/");
        return null;
    }

    // If there are errors, show toast
    if (state?.success === false && state?.message) {
        toast.error(state.message);
    }

    return (
        <Card className="w-full max-w-md shadow-lg p-16">
            <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                    <Logo variant="full" size="lg" href="#" />
                </div>
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Sign in to access the SmartTrans dashboard
                </p>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@safaricom.com"
                            required
                            disabled={isPending}
                            className="h-11"
                        />
                        {state?.data?.errors?.find((e: any) => e.field === "email") && (
                            <p className="text-sm text-red-500">
                                {state.data.errors.find((e: any) => e.field === "email").message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="h-11 pr-10"
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
                        {state?.data?.errors?.find((e: any) => e.field === "password") && (
                            <p className="text-sm text-red-500">
                                {state.data.errors.find((e: any) => e.field === "password").message}
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
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
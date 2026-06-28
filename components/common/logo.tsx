"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    variant?: "full" | "icon" | "compact";
    className?: string;
    showText?: boolean;
    href?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({
    variant = "full",
    className,
    showText = true,
    href = "/",
    size = "md",
}: LogoProps) {
    // Size mappings
    const sizeMap = {
        sm: {
            image: 28,
            text: "text-sm",
            gap: "gap-1.5",
            padding: "p-1.5",
        },
        md: {
            image: 36,
            text: "text-lg",
            gap: "gap-2",
            padding: "p-2",
        },
        lg: {
            image: 48,
            text: "text-2xl",
            gap: "gap-3",
            padding: "p-3",
        },
        xl: {
            image: 64,
            text: "text-3xl",
            gap: "gap-4",
            padding: "p-4",
        },
    };

    const sizes = sizeMap[size];

    // Different variants
    if (variant === "icon") {
        return (
            <Link href={href} className={cn("inline-block", className)}>
                <div
                    className={cn(
                        "relative flex items-center justify-center rounded-lg",
                        sizes.padding
                    )}
                >
                    <Image
                        src="/images/smart-trans.png"
                        alt="SmartTrans Logo"
                        width={sizes.image}
                        height={sizes.image}
                        className="object-contain"
                        priority
                    />
                </div>
            </Link>
        );
    }

    if (variant === "compact") {
        return (
            <Link href={href} className={cn("inline-flex items-center", sizes.gap, className)}>
                <div className="relative flex items-center justify-center rounded-lg  p-1.5">
                    <Image
                        src="/images/smart-trans.png"
                        alt="SmartTrans Logo"
                        width={sizes.image * 0.7}
                        height={sizes.image * 0.7}
                        className="object-contain"
                        priority
                    />
                </div>
                {showText && (
                    <span className={cn("font-bold text-slate-900 dark:text-white", sizes.text)}>
                        Smart<span className="text-emerald-600">Trans</span>
                    </span>
                )}
            </Link>
        );
    }

    // Full (default)
    return (
        <Link href={href} className={cn("inline-flex items-center", sizes.gap, className)}>
            <div className={cn("relative rounded-lg", sizes.padding)}>
                <Image
                    src="/images/smart-trans.png"
                    alt="SmartTrans Logo"
                    width={sizes.image}
                    height={sizes.image}
                    className="object-contain"
                    priority
                />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={cn("font-bold leading-tight text-slate-900 dark:text-white", sizes.text)}>
                        Smart<span className="text-emerald-600">Trans</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        Transformer Monitoring
                    </span>
                </div>
            )}
        </Link>
    );
}
"use client";

import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function ToasterWrapper() {
    const isMobile = useIsMobile();

    return (
        <Toaster
            position={isMobile ? "bottom-center" : "top-right"}
            closeButton
            richColors
            expand={isMobile}
            visibleToasts={isMobile ? 3 : 5}
        />
    );
}
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth.context";
import { AppLayout } from "@/components/layout/app-layout";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/hooks/use-auth-guard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Trans - Transformer Monitoring Dashboard",
  description: "Real-time transformer monitoring for Safaricom Ethiopia",
  icons: {
    icon: "/images/smart-trans.png",
    apple: "/images/smart-trans.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn(inter.className, "min-h-full flex flex-col")}>
        <AuthProvider>
          <AuthGuard>
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
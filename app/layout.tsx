import { AuthProvider } from "@/context/auth.context";
import { AppLayout } from "@/components/layout/app-layout";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/hooks/use-auth-guard";
import { ToasterWrapper } from "@/components/common/toaster-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Trans - Transformer Monitoring Dashboard",
  description: "Real-time transformer monitoring for Vodafone",
  icons: {
    icon: "/images/smart-trans.png",
    apple: "/images/smart-trans.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn(inter.className, "min-h-full flex flex-col antialiased")}>
        <AuthProvider>
          <AuthGuard>
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </AuthProvider>
        <ToasterWrapper />
      </body>
    </html>
  );
}
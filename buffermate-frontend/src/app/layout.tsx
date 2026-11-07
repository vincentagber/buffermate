import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Buffermate AI - Smart Social Media Scheduling & Automation",
  description: "Automate your social media presence with AI-powered scheduling, comment auto-replies, and DM dispatches.",
  other: {
    "tiktok-developers-site-verification": "ovKF1UhYuCLyPs69BRW0ltEuGF3Ch73q",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="tiktok-developers-site-verification"
          content="ovKF1UhYuCLyPs69BRW0ltEuGF3Ch73q"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

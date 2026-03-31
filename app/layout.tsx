import type { Metadata } from "next";
// Font import removed due to Next.js build fetch error. Using system default.
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/shared/AuthProvider";

// Font definition removed

export const metadata: Metadata = {
  title: "EduBridge - Peer-to-Peer Learning Platform",
  description: "Connecting underserved school students with college volunteers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="font-sans min-h-screen flex flex-col bg-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

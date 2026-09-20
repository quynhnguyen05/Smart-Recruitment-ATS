import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Áp dụng font Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireFlow AI - ATS",
  description: "Smart Recruitment ATS System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface-50 text-gray-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
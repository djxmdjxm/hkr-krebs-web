import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageHeader from "@/components/PageHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krebs DB",
  description:
    "Krebs Database: A collection of clinical oncology data from Germany.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen bg-gray-50`}
      >
        <PageHeader />

        <main className="flex flex-col grow min-h-full bg-gray-50">
          {children}
        </main>

        <footer className="flex flex-col bg-gray-50 text-center py-6">
          © KIKA 2025
        </footer>
      </body>
    </html>
  );
}

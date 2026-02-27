import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sai PSB Laboratory",
  description: "Premium Laboratory Chemicals & Supplies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-white relative`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white"></div>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

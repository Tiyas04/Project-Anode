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
        className={`${inter.className} antialiased bg-black relative`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 [background:radial-gradient(circle_at_50%_10%,#1e293b_10%,#020617_100%)]"></div>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

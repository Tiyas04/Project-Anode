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
        className={`${inter.className} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

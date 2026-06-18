import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sai PSB Laboratory",
  description: "Discover high-quality laboratory equipment, services, and solutions at Sai PSB Laboratory.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "Sai PSB Laboratory",
    "Laboratory",
    "Lab Equipment",
    "Lab Services",
    "Science",
    "Research",
  ],
  authors: [{ name: "Sai PSB Laboratory" }],
  creator: "Sai PSB Laboratory",
  publisher: "Sai PSB Laboratory",

  openGraph: {
    title: "Sai PSB Laboratory",
    description: "Discover high-quality laboratory equipment, services, and solutions at Sai PSB Laboratory.",
    url: "https://www.saipsb.com",
    siteName: "Sai PSB Laboratory",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://saipsb.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sai PSB Laboratory",
      },
    ],
  },

  metadataBase: new URL("https://www.saipsb.com"),

  alternates: {
    canonical: "https://www.saipsb.com",
  },

  verification: {
    google:"",
  },
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

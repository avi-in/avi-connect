import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AviConnect",
  description: "Where Professionals Meet Potential",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className='min-h-screen flex flex-col'
      >
        {/* Toaster */}
        <header className="border-b sticky top-0 bg-white z-50">
          <Header />
        </header>
        <div className="bg-[#F4F2BG] flex-1 w-full">
          {children}
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}

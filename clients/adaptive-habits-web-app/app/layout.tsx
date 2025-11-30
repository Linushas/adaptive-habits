import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar"
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adaptive Habits",
  description: "Habit tracker that adapts to the user's progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} antialiased bg-bg`}
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}

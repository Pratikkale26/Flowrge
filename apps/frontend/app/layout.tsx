import type React from "react"
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { Appbar } from "../components/Appbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowrge - Automate on Solana in minutes",
  description: "Triggers and actions across Web3 & Web2 without writing code. The Zapier for Solana.",
  keywords: ["Solana", "automation", "no-code", "Web3", "Flowrge"],
  openGraph: {
    title: "Flowrge",
    description:
      "Low-code automation for Solana — create on-chain triggers and off-chain actions in minutes.",
    url: "https://flowrge.xyz",
    siteName: "Flowrge",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* <Appbar/> */}
        {children}
      </body>
    </html>
  );
}

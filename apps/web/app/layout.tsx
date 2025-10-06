import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import WalletContextProvider from "../components/WalletAdaptors";
import { Appbar } from "../components/Appbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Flowrge - Automate on Solana in minutes",
  description: "Triggers and actions across Web3 & Web2 without writing code. The Zapier for Solana.",
  keywords: ["Solana", "automation", "low-code", "Web3", "Flowrge"],
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
}: Readonly<{ children: React.ReactNode }>) { 
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overflow-x-hidden`}>
        <WalletContextProvider>
          <Appbar />
          {/* Reserve space for fixed header */}
          <main className="pt-16 relative z-0">{children}</main>
        </WalletContextProvider>
      </body>
    </html>
  );
}

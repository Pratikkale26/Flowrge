"use client";

import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Zap } from "lucide-react";

export const Appbar = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        // { label: "Docs", onClick: () => router.push("/docs") },
        // { label: "Community", onClick: () => router.push("/community") },
      ]
    : [{ label: "About", onClick: () => {} }];

  return (
    <header className="w-full bg-card/50 backdrop-blur-sm border-b border-border shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2 group" onClick={ () => router.push("/")}>
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
            <Zap className="w-5 h-5 text-white group-hover:drop-shadow-glow" />
          </div>
          <span className="text-xl font-bold text-balance group-hover:text-primary transition-colors">Flowrge</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4">
          {navLinks.map((link, idx) => (
            <LinkButton key={idx} onClick={link.onClick}>
              {link.label}
            </LinkButton>
          ))}

          {!isAuthenticated && (
            <>
              <LinkButton onClick={() => router.push("/login")}>Login</LinkButton>
              <PrimaryButton onClick={() => router.push("/signup")}>Sign Up</PrimaryButton>
            </>
          )}

          {/* Logout button */}
          {isAuthenticated && (
            <PrimaryButton onClick={handleLogout}>
              Logout
            </PrimaryButton>
          )}

          {/* Wallet */}
          {publicKey ? (
            <WalletDisconnectButton className="!ml-4 !bg-destructive hover:!bg-destructive/90" />
          ) : (
            <WalletMultiButton className="!ml-4 !bg-primary hover:!bg-primary/90" />
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-accent/10 transition-colors"
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-card/90 backdrop-blur-md border-t border-border w-full px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link, idx) => (
            <LinkButton
              key={idx}
              onClick={() => {
                link.onClick();
                setMenuOpen(false);
              }}
            >
              {link.label}
            </LinkButton>
          ))}

          {!isAuthenticated && (
            <>
              <LinkButton
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </LinkButton>
              <PrimaryButton
                onClick={() => {
                  router.push("/signup");
                  setMenuOpen(false);
                }}
              >
                Sign Up
              </PrimaryButton>
            </>
          )}

          {isAuthenticated && (
            <PrimaryButton
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </PrimaryButton>
          )}

          {publicKey ? (
            <WalletDisconnectButton className="!bg-destructive hover:!bg-destructive/90" />
          ) : (
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
          )}
        </div>
      )}
    </header>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import axios from "axios";
import { Zap, Loader2 } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";

export const Appbar = () => {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  const handleSignMessageAndSend = async () => {
    if (!signMessage || !publicKey) return;
    try {
      setLoading(true);
      const message = new TextEncoder().encode("Sign in into Flowrge");
      const signature = await signMessage(message);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`, {
        signature,
        publicKey: publicKey.toBase58(),
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign-in failed", err);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = isAuthenticated
    ? [{ label: "Dashboard", onClick: () => router.push("/dashboard") }]
    : [{ label: "About", onClick: () => router.push("/about") }];

  return (
    <header className="w-full bg-background/60 backdrop-blur-md border-b border-border fixed top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Zap className="w-5 h-5 text-white group-hover:drop-shadow-glow" />
          </div>
          <span className="text-lg font-semibold tracking-wide group-hover:text-primary transition-colors">
            Flowrge
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-4">
          {navLinks.map((link) => (
            <LinkButton key={link.label} onClick={link.onClick}>
              {link.label}
            </LinkButton>
          ))}

          {!isAuthenticated && publicKey? (
            <PrimaryButton onClick={handleSignMessageAndSend} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Wallet"}
            </PrimaryButton>
          ) : (
            isAuthenticated && <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
          )}

          {publicKey ? (
            <WalletDisconnectButton className="!ml-4 !bg-destructive hover:!bg-destructive/90" />
          ) : (
            <WalletMultiButton className="!ml-4 !bg-primary hover:!bg-primary/90" />
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
        >
          {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-card/95 backdrop-blur-md border-t border-border w-full px-6 py-4 flex flex-col gap-4 shadow-lg"
          >
            {navLinks.map((link) => (
              <LinkButton
                key={link.label}
                onClick={() => {
                  link.onClick();
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </LinkButton>
            ))}

            {!isAuthenticated && publicKey ? (
              <PrimaryButton onClick={handleSignMessageAndSend} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Wallet"}
              </PrimaryButton>
            ) : (
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

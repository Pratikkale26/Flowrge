"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
}: PrimaryButtonProps) => {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      whileHover={!disabled ? { scale: 1.03, boxShadow: "0 0 15px rgba(124,58,237,0.8)" } : {}}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 px-5 py-3 text-white text-sm shadow-md",
        "bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]",
        "hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] focus:ring-offset-2 focus:ring-offset-background",
        fullWidth ? "w-full" : "",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      ) : (
        <span className="relative z-10">{children}</span>
      )}

      {/* Optional neon glow overlay */}
      {!disabled && (
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-400 opacity-10 blur-xl pointer-events-none"></span>
      )}
    </motion.button>
  );
};

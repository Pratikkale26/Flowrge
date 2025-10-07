"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkButton } from "../buttons/LinkButton";

interface Zap {
  id: string;
  name: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

interface ZapCardProps {
  zap: Zap;
  onEdit?: (zapId: string) => void;
  onDelete?: (zapId: string) => void;
  onDuplicate?: (zapId: string) => void;
}

export function ZapCard({ zap, onEdit, onDelete, onDuplicate }: ZapCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const handleGoToZap = () => {
    router.push(`/zap/${zap.id}`);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="relative bg-[#111111]/90 border border-zinc-800 rounded-2xl p-5 hover:bg-[#181818] hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col space-y-3">
          {/* Zap Name */}
          <h2 className="text-lg font-semibold text-zinc-100 bg-zinc-800/70 rounded-full px-4 py-1 w-fit border border-zinc-700">
            {zap.name || "Untitled Flow"}
          </h2>

          {/* Trigger and Actions */}
          <div className="flex items-center space-x-2">
            <img
              src={zap.trigger.type.image}
              alt={zap.trigger.type.name}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-sm text-zinc-500">→</span>
            <div className="flex space-x-1">
              {zap.actions.map((action) => (
                <img
                  key={action.id}
                  src={action.type.image}
                  alt={action.type.name}
                  className="w-8 h-8 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">Active</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-sm text-zinc-400">
          Created {formatDate("2024-09-19")} • {zap.actions.length} action
          {zap.actions.length !== 1 ? "s" : ""}
        </p>

        <div className="bg-zinc-900/70 rounded-lg p-3 border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1">Webhook URL</p>
          <code className="text-xs text-zinc-200 break-all">
            {`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/1/${zap.id}`}
          </code>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-5">
        <LinkButton onClick={handleGoToZap}>View Details</LinkButton>

        <button
          onClick={() => setShowActions(!showActions)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {showActions && (
          <div className="absolute right-4 bottom-16 bg-[#161616] border border-zinc-800 rounded-xl shadow-lg p-2 z-10 w-36 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => onEdit?.(zap.id)}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDuplicate?.(zap.id)}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
            >
              Duplicate
            </button>
            <button
              onClick={() => onDelete?.(zap.id)}
              className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


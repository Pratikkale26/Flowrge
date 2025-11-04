"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  const userId = zap.userId;
  const [showActions, setShowActions] = useState(false);
  const [activating, setActivating] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [matchedSubId, setMatchedSubId] = useState<string | null>(null);
  const [isActiveSub, setIsActiveSub] = useState<boolean | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);
  const triggerAddress = useMemo(() => {
    try {
      // backend should return trigger.metadata with address
      const anyTrigger: any = zap?.trigger as any;
      const addr = anyTrigger?.metadata?.address;
      return typeof addr === "string" && addr.length > 0 ? addr : undefined;
    } catch {
      return undefined;
    }
  }, [zap?.trigger]);

  const handleGoToZap = () => {
    router.push(`/zap/${zap.id}`);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isSolanaTrigger = () => {
    const name = (zap?.trigger?.type?.name || "").toLowerCase();
    return name.includes("sol") || name.includes("solana");
  };

  const loadMatchingSubscription = async () => {
    if (!apiBase || !token || !triggerAddress) return;
    setLoadingSub(true);
    try {
      const res = await axios.get(`${apiBase}/api/v1/zerion/subscriptions`, { headers: { Authorization: `Bearer ${token}` } });
      const list: any[] = res.data?.data || [];
      const match = list.find((s) => {
        const zapIdMatch = s.zapId === zap.id;
        const addr: string = s.walletAddress || s.address || "";
        const chain: string = (s.chainId || s.chain_id || "").toLowerCase();
        return zapIdMatch && addr.toLowerCase() === triggerAddress.toLowerCase() && chain.includes("solana");
      });
      setMatchedSubId(match?.subscriptionId || null);
      setIsActiveSub(typeof match?.isActive === "boolean" ? !!match.isActive : null);
    } catch (e) {
      // ignore
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (isSolanaTrigger() && triggerAddress) {
      loadMatchingSubscription();
    } else {
      setMatchedSubId(null);
      setIsActiveSub(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAddress, zap.id]);

  const activateOnChain = async () => {
    if (!apiBase || !token) return;
    if (!triggerAddress) { alert("Trigger address missing in this flow"); return; }
    setActivating(true);
    try {
      const res = await axios.post(
        `${apiBase}/api/v1/zerion/subscriptions`,
        {
          walletAddress: triggerAddress,
          chainId: "solana",
          zapId: zap.id,
          callbackUrl: undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data?.data;
      if (created?.subscriptionId) {
        setMatchedSubId(created.subscriptionId);
        setIsActiveSub(!!created.isActive);
      }
      alert("Subscription created. You can enable it to start receiving events.");
    } catch (e: any) {
      alert(e?.response?.data?.error || e.message || "Activation failed");
    } finally {
      setActivating(false);
    }
  };

  const deactivateOnChain = async () => {
    if (!apiBase || !token || !matchedSubId) return;
    setActivating(true);
    try {
      await axios.delete(`${apiBase}/api/v1/zerion/subscriptions/${matchedSubId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("On-chain trigger deactivated");
      setMatchedSubId(null);
    } catch (e: any) {
      alert(e?.response?.data?.error || e.message || "Deactivation failed");
    } finally {
      setActivating(false);
    }
  };

  const enableSubscription = async () => {
    if (!apiBase || !token || !matchedSubId) return;
    setActivating(true);
    try {
      await axios.patch(`${apiBase}/api/v1/zerion/subscriptions/${matchedSubId}/enable`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Subscription enabled successfully");
      setIsActiveSub(true);
      await loadMatchingSubscription();
    } catch (e: any) {
      alert(e?.response?.data?.error || e.message || "Enable failed");
    } finally {
      setActivating(false);
    }
  };

  const disableSubscription = async () => {
    if (!apiBase || !token || !matchedSubId) return;
    setActivating(true);
    try {
      await axios.patch(`${apiBase}/api/v1/zerion/subscriptions/${matchedSubId}/disable`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Subscription disabled successfully");
      setIsActiveSub(false);
      await loadMatchingSubscription();
    } catch (e: any) {
      alert(e?.response?.data?.error || e.message || "Disable failed");
    } finally {
      setActivating(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <code className="text-xs text-zinc-200 break-all flex-1">
              {`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/${userId}/${zap.id}`}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/${userId}/${zap.id}`)}
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200"
            >Copy</button>
          </div>
        </div>

        {isSolanaTrigger() && (
          <div className="rounded-lg p-3 border border-emerald-900/40 bg-emerald-900/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300">Solana trigger detected</p>
                <p className="text-xs text-emerald-500">{
                  loadingSub
                    ? "Checking status..."
                    : matchedSubId
                      ? (isActiveSub ? "Subscription active" : "Subscription disabled")
                      : (triggerAddress ? "Create a subscription for this wallet to manage on-chain events." : "Configure a wallet address in the trigger to proceed.")
                }</p>
              </div>
              {matchedSubId ? (
                <div className="flex space-x-2">
                  {isActiveSub ? (
                    <button
                      onClick={disableSubscription}
                      disabled={activating}
                      className="text-sm rounded-md px-3 py-2 bg-orange-600 text-white disabled:opacity-60"
                    >{activating ? "Disabling..." : "Disable"}</button>
                  ) : (
                    <button
                      onClick={enableSubscription}
                      disabled={activating}
                      className="text-sm rounded-md px-3 py-2 bg-blue-600 text-white disabled:opacity-60"
                    >{activating ? "Enabling..." : "Enable"}</button>
                  )}
                  <button
                    onClick={deactivateOnChain}
                    disabled={activating}
                    className="text-sm rounded-md px-3 py-2 bg-rose-600 text-white disabled:opacity-60"
                  >{activating ? "Deleting..." : "Delete"}</button>
                </div>
              ) : (
                <button
                  onClick={activateOnChain}
                  disabled={activating || !triggerAddress}
                  className="text-sm rounded-md px-3 py-2 bg-emerald-600 text-white disabled:opacity-60"
                >{activating ? "Creating..." : (triggerAddress ? "Create subscription" : "Add Trigger Address")}</button>
              )}
            </div>
          </div>
        )}
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


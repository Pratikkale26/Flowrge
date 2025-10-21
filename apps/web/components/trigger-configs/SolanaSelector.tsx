"use client";

import { useState } from "react";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface SolanaSelectorProps {
    setMetadata: (params: { 
        address: string;
        network: "devnet" | "mainnet";
        transactionType: string;
    }) => void;
}

export function SolanaSelector({ setMetadata }: SolanaSelectorProps) {
    const [address, setAddress] = useState("");
    const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");
    const [transactionType, setTransactionType] = useState("Any");

    const transactionTypes = [
        "Any",
        "TRANSFER",
        "TOKEN_MINT",
        "TOKEN_TRANSFER", 
        "NFT_MINT",
        "NFT_TRANSFER",
        "SWAP",
        "STAKE",
        "UNSTAKE",
        "BURN"
    ];

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Wallet Address</label>
                <input 
                    type="text" 
                    placeholder="Solana wallet address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Network</label>
                <select 
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as "devnet" | "mainnet")}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                >
                    <option value="devnet">Devnet</option>
                    <option value="mainnet">Mainnet</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Transaction Type</label>
                <select 
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                >
                    {transactionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="pt-4">
                <PrimaryButton onClick={() => setMetadata({ address, network, transactionType })}>
                    Confirm Configuration
                </PrimaryButton>
            </div>
        </div>
    );
}

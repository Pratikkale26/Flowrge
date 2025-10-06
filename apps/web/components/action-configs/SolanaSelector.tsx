"use client";

import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface SolanaSelectorProps {
    setMetadata: (params: { amount: string; address: string }) => void;
}

export function SolanaSelector({ setMetadata }: SolanaSelectorProps) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");

    return (
        <div className="space-y-4">
            <Input label="Recipient Address" type="text" placeholder="Solana wallet address" onChange={(e) => setAddress(e.target.value)} />
            <Input label="Amount (SOL)" type="text" placeholder="e.g., 0.5" onChange={(e) => setAmount(e.target.value)} />
            <div className="pt-4">
                <PrimaryButton onClick={() => setMetadata({ amount, address })}>
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}

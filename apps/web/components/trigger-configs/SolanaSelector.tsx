"use client";

import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface SolanaSelectorProps {
    setMetadata: (params: { address: string }) => void;
}

export function SolanaSelector({ setMetadata }: SolanaSelectorProps) {
    const [address, setAddress] = useState("");

    return (
        <div className="space-y-4">
            <Input label="Trigger Address" type="text" placeholder="Solana wallet address" onChange={(e) => setAddress(e.target.value)} />
            <div className="pt-4">
                <PrimaryButton onClick={() => setMetadata({ address })}>
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}

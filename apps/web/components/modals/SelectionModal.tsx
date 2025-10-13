"use client";

import { useState } from "react";
import { EmailSelector } from "../action-configs/EmailSelector";
import { SolanaSelector as ActionSolanaSelector } from "../action-configs/SolanaSelector";
import { XPostSelector } from "../action-configs/XPostSelector";
import { SolanaSelector as TriggerSolanaSelector } from "../trigger-configs/SolanaSelector";

interface AvailableItem {
    id: string;
    name: string;
    image: string;
}

interface ModalSelection extends AvailableItem {
    metadata: any;
}

interface SelectionModalProps {
    onSelect: (selection: ModalSelection | null) => void;
    availableItems?: AvailableItem[];
    isTrigger: boolean;
}

// A map to associate action IDs with their specific configuration components.
const ACTION_CONFIG_COMPONENTS: Record<string, React.FC<{ setMetadata: (params: any) => void }>> = {
    'email': EmailSelector,
    'sol': ActionSolanaSelector,
    'x-post': XPostSelector,
};

// A map to associate trigger IDs with their specific configuration components.
const TRIGGER_CONFIG_COMPONENTS: Record<string, React.FC<{ setMetadata: (params: any) => void }>> = {
    'sol': TriggerSolanaSelector,
};

export function SelectionModal({ onSelect, availableItems = [], isTrigger }: SelectionModalProps) {
    const [step, setStep] = useState(0);
    const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);

    // Normalize an item into a lookup key for config components (DB ids are UUIDs)
    const getLookupKey = (item: AvailableItem) => {
        const normalized = (item.name || "").trim().toLowerCase();
        if (normalized.includes("solana")) return "sol";
        if (normalized.includes("email")) return "email";
        if (normalized.includes("post on x") || normalized.includes("x post")) return "x-post";
        return item.id; // fallback to id
    };

    const handleItemClick = (item: AvailableItem) => {
        const lookupKey = getLookupKey(item);
        if (isTrigger) {
            // If it's a trigger and has a config component, open config; otherwise select immediately.
            if (TRIGGER_CONFIG_COMPONENTS[lookupKey]) {
                setSelectedItem(item);
                setStep(1);
            } else {
                onSelect({ ...item, metadata: {} });
            }
            return;
        }

        // For actions, if a config component exists, open it; otherwise select immediately.
        if (ACTION_CONFIG_COMPONENTS[lookupKey]) {
            setSelectedItem(item);
            setStep(1);
        } else {
            onSelect({ ...item, metadata: {} });
        }
    };

    const handleMetadataSubmit = (metadata: any) => {
        if (selectedItem) {
            onSelect({ ...selectedItem, metadata });
        }
    };
    
    // The component to render for configuration (trigger or action).
    const ConfigComponent = selectedItem
        ? (isTrigger
            ? TRIGGER_CONFIG_COMPONENTS[getLookupKey(selectedItem)]
            : ACTION_CONFIG_COMPONENTS[getLookupKey(selectedItem)])
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-2xl">
                <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border">
                    {/* Modal Header */}
                    <header className="flex items-center justify-between p-6 border-b border-border/50 rounded-t-2xl">
                        <h3 className="text-xl font-semibold text-foreground">
                            {step === 0 ? `Select ${isTrigger ? "Trigger" : "Action"}` : `Configure: ${selectedItem?.name}`}
                        </h3>
                        <button onClick={() => onSelect(null)} type="button" className="text-muted-foreground bg-transparent hover:bg-muted/50 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0-0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </header>
                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                        {step === 0 && (
                            <div className="space-y-3">
                                {availableItems.map((item) => (
                                    <div key={item.id} onClick={() => handleItemClick(item)} className="flex items-center gap-4 border border-border/50 p-4 cursor-pointer hover:bg-muted/30 rounded-xl transition-all duration-200 hover:border-accent/30">
                                        <img src={item.image} alt={item.name} width={32} height={32} className="rounded-full" />
                                        <span className="font-medium text-foreground">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {step === 1 && ConfigComponent && <ConfigComponent setMetadata={handleMetadataSubmit} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

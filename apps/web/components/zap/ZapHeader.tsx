"use client";

import { PrimaryButton } from "../buttons/PrimaryButton";

interface ZapHeaderProps {
    totalPayment: number;
    isPublishing: boolean;
    onPublish: () => void;
}

export function ZapHeader({ totalPayment, isPublishing, onPublish }: ZapHeaderProps) {
    return (
        <header className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-6 border-b border-border">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-foreground">Create Flow</h1>
                {totalPayment > 0 && (
                    <div className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg text-sm font-medium">
                        Payment Required: {totalPayment} SOL
                    </div>
                )}
            </div>
            <PrimaryButton onClick={onPublish}>
                {isPublishing ? 'Publishing...' : 'Publish'}
            </PrimaryButton>
        </header>
    );
}

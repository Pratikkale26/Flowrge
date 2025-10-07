"use client";

import { ZapCard } from "./ZapCard";

interface Zap {
    "id": string,
    "name": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

interface ZapGridProps {
    zaps: Zap[];
    onEdit?: (zapId: string) => void;
    onDelete?: (zapId: string) => void;
    onDuplicate?: (zapId: string) => void;
}

export function ZapGrid({ zaps, onEdit, onDelete, onDuplicate }: ZapGridProps) {
    if (zaps.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Zaps Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first automated workflow to get started</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zaps.map((zap) => (
                <ZapCard
                    key={zap.id}
                    zap={zap}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                />
            ))}
        </div>
    );
}


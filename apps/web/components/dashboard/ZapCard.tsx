"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkButton } from "../buttons/LinkButton";

interface Zap {
    "id": string,
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <img 
                            src={zap.trigger.type.image} 
                            alt={zap.trigger.type.name}
                            className="w-8 h-8 rounded-lg"
                        />
                        <span className="text-sm text-muted-foreground">→</span>
                        <div className="flex space-x-1">
                            {zap.actions.map((action, index) => (
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
                
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Active</span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">
                    {zap.trigger.type.name} → {zap.actions.map(a => a.type.name).join(' → ')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                    Created {formatDate('2024-09-19')} • {zap.actions.length} action{zap.actions.length !== 1 ? 's' : ''}
                </p>
                <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Webhook URL</p>
                    <code className="text-xs text-foreground break-all">
                        {`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/1/${zap.id}`}
                    </code>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <LinkButton onClick={handleGoToZap}>
                        View Details
                    </LinkButton>
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                
                {showActions && (
                    <div className="absolute right-4 top-16 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
                        <button
                            onClick={() => onEdit?.(zap.id)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDuplicate?.(zap.id)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                            Duplicate
                        </button>
                        <button
                            onClick={() => onDelete?.(zap.id)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-destructive"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


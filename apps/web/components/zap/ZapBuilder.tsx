"use client";

import React from "react";
import { ZapCell } from "../ZapCell";
import { SelectedAction, SelectedTrigger } from "../../types/zap";

interface ZapBuilderProps {
    selectedTrigger: SelectedTrigger | null;
    selectedActions: SelectedAction[];
    onTriggerClick: () => void;
    onActionClick: (actionKey: number) => void;
    onAddAction: () => void;
    onDeleteAction: (actionKey: number) => void;
}

export function ZapBuilder({
    selectedTrigger,
    selectedActions,
    onTriggerClick,
    onActionClick,
    onAddAction,
    onDeleteAction
}: ZapBuilderProps) {
    return (
        <div className="space-y-4 flex flex-col items-center">
            {/* Trigger Cell */}
            <ZapCell
                onClick={onTriggerClick}
                name={selectedTrigger?.name || "Choose Trigger"}
                index={1}
            />
            
            {/* Action Cells */}
            {selectedActions.map(action => (
                <div key={action.key} className="relative group">
                    <ZapCell
                        onClick={() => onActionClick(action.key)}
                        name={action.availableActionName || "Choose Action"}
                        index={action.visualIndex}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAction(action.key);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        aria-label="Delete action"
                    >
                        ×
                    </button>
                </div>
            ))}

            {/* Add Action Button */}
            <div className="pt-2">
                <button 
                    onClick={onAddAction}
                    className="w-12 h-12 flex items-center justify-center bg-card/80 hover:bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xl font-medium text-muted-foreground hover:text-accent border border-border hover:border-accent/50 backdrop-blur-sm"
                    aria-label="Add Action"
                >
                    +
                </button>
            </div>
        </div>
    );
}

"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Components
import { ZapHeader } from "../../../components/zap/ZapHeader";
import { ZapBuilder } from "../../../components/zap/ZapBuilder";
import { PaymentModal } from "../../../components/modals/PaymentModal";
import { SelectionModal } from "../../../components/modals/SelectionModal";

// Hooks and utilities
import { useAvailableZapElements } from "../../../hooks/useAvailableZapElements";
import { calculateTotalPayment } from "../../../utils/payment";

// Types
import { SelectedAction, SelectedTrigger, ModalState, ModalSelection } from "../../../types/zap";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PAYMENT_PUBKEY = "FkUQR7H6FoNA4buay4qfXeVoxe31hz92gpsz5vEwbv5B";



// --- MAIN PAGE COMPONENT ---
export default function CreateZapPage() {
    const router = useRouter();
    const { availableActions, availableTriggers, isLoading, error } = useAvailableZapElements();
    const { publicKey, sendTransaction, connected } = useWallet();

    const [selectedTrigger, setSelectedTrigger] = useState<SelectedTrigger | null>(null);
    const [selectedActions, setSelectedActions] = useState<SelectedAction[]>([]);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

    // A more descriptive state for managing the modal's visibility and context.
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

    /**
     * Handles adding a new, empty action to the list.
     */
    const handleAddAction = useCallback(() => {
        setSelectedActions(currentActions => {
            const nextKey = (currentActions[currentActions.length - 1]?.key || 0) + 1;
            const newAction: SelectedAction = {
                key: nextKey,
                visualIndex: currentActions.length + 2,
                availableActionId: "",
                availableActionName: "",
                metadata: {},
            };
            return [...currentActions, newAction];
        });
    }, []);

    /**
     * Handles deleting an action from the list.
     */
    const handleDeleteAction = useCallback((actionKey: number) => {
        setSelectedActions(currentActions => {
            const filteredActions = currentActions.filter(action => action.key !== actionKey);
            // Recalculate visual indices
            return filteredActions.map((action, index) => ({
                ...action,
                visualIndex: index + 2
            }));
        });
    }, []);

    /**
     * Handles payment processing
     */
    const handlePayment = async () => {
        if (!publicKey || !connected) {
            alert("Please connect your wallet first.");
            return;
        }

        const totalAmount = calculateTotalPayment(selectedActions);
        if (totalAmount <= 0) {
            // No payment needed, proceed directly to publish
            await handlePublish();
            return;
        }

        setIsProcessingPayment(true);
        try {
            const connection = new Connection("https://api.devnet.solana.com");
            const recipientPubkey = new PublicKey(PAYMENT_PUBKEY);
            const lamports = Math.floor(totalAmount * LAMPORTS_PER_SOL);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey,
                    lamports,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            // Payment successful, now publish the zap
            await handlePublish();
            setShowPaymentModal(false);
        } catch (err) {
            console.error("Payment failed:", err);
            alert(`Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    /**
     * Handles publishing the created Zap to the backend.
     */
    const handlePublish = async () => {
        if (!selectedTrigger?.id || selectedActions.some(a => !a.availableActionId)) {
            alert("Please select a trigger and configure all actions before publishing.");
            return;
        }
        
        setIsPublishing(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                availableTriggerId: selectedTrigger.id,
                triggerMetadata: {},
                actions: selectedActions.map(a => ({
                    availableActionId: a.availableActionId,
                    actionMetadata: a.metadata,
                })),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to publish zap:", err);
            // Provide user feedback. A toast notification.
            alert(`Error publishing Zap: ${(err as AxiosError).message || 'Unknown error'}`);
        } finally {
            setIsPublishing(false);
        }
    };

    /**
     * Handles the publish button click - shows payment modal if needed
     */
    const handlePublishClick = () => {
        const totalAmount = calculateTotalPayment(selectedActions);
        if (totalAmount > 0) {
            setShowPaymentModal(true);
        } else {
            handlePublish();
        }
    };

    /**
     * Callback for when an item is selected in the modal.
     * Encapsulates the logic for updating either the trigger or a specific action.
     */
    const handleModalSelect = (selection: ModalSelection | null) => {
        if (modalState.isOpen) {
            if (selection) { // An item was selected
                if (modalState.type === 'trigger') {
                    setSelectedTrigger({ id: selection.id, name: selection.name });
                } else if (modalState.type === 'action' && modalState.actionKey !== undefined) {
                    const { actionKey } = modalState;
                    setSelectedActions(acts => acts.map(act =>
                        act.key === actionKey
                            ? { ...act, availableActionId: selection.id, availableActionName: selection.name, metadata: selection.metadata }
                            : act
                    ));
                }
            }
        }
        // Always close the modal after selection or cancellation.
        setModalState({ isOpen: false });
    };

    if (isLoading) {
        return <div className="min-h-screen bg-background flex justify-center items-center"><p className="text-foreground">Loading...</p></div>;
    }
    
    if (error) {
        return <div className="min-h-screen bg-background flex justify-center items-center"><p className="text-destructive">{error}</p></div>;
    }

    const totalPayment = calculateTotalPayment(selectedActions);

    return (
        <>
            <ZapHeader
                totalPayment={totalPayment}
                isPublishing={isPublishing}
                onPublish={handlePublishClick}
            />
            <main className="w-full min-h-screen bg-background flex flex-col items-center pt-10">
                <ZapBuilder
                    selectedTrigger={selectedTrigger}
                    selectedActions={selectedActions}
                    onTriggerClick={() => setModalState({ isOpen: true, type: 'trigger' })}
                    onActionClick={(actionKey) => setModalState({ isOpen: true, type: 'action', actionKey })}
                    onAddAction={handleAddAction}
                    onDeleteAction={handleDeleteAction}
                />
            </main>

            {modalState.isOpen && (
                <SelectionModal
                    onSelect={handleModalSelect}
                    availableItems={modalState.type === 'trigger' ? availableTriggers : availableActions}
                    isTrigger={modalState.type === 'trigger'}
                />
            )}

            {showPaymentModal && (
                <PaymentModal
                    totalAmount={totalPayment}
                    onPay={handlePayment}
                    onCancel={() => setShowPaymentModal(false)}
                    isProcessing={isProcessingPayment}
                    isConnected={connected}
                />
            )}
        </>
    );
}



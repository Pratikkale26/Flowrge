"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

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
    const { publicKey, signTransaction, connected } = useWallet();

    const [zapName, setZapName] = useState<string>("");
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
            if (!signTransaction) {
                throw new Error("Wallet does not support transaction signing.");
            }

            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            // Prepare transfers from all SOL actions
            const transfers = selectedActions
                .filter(a => a.availableActionId === 'sol' && a.metadata?.address && a.metadata?.amount)
                .map(a => ({
                    toAddress: String(a.metadata.address),
                    lamports: Math.floor(parseFloat(String(a.metadata.amount)) * LAMPORTS_PER_SOL),
                }));

            if (transfers.length === 0) {
                // No SOL actions; just finish
                setShowPaymentModal(false);
                router.push("/dashboard");
                return;
            }

            // Atomic create + durable build
            const createRes = await axios.post(`${BACKEND_URL}/api/v1/zap/create-with-durable`, {
                zapName: zapName,
                availableTriggerId: selectedTrigger?.id,
                triggerMetadata: selectedTrigger?.metadata || {},
                actions: selectedActions.map(a => ({
                    availableActionId: a.availableActionId,
                    actionMetadata: a.metadata,
                })),
                feePayerPubkey: publicKey.toBase58(),
                transfers,
                platformFeeLamports: 0,
            }, { headers: { Authorization: `Bearer ${token}` } });

            const zapId: string | undefined = createRes?.data?.zapId;
            const durable = createRes?.data?.durable;
            if (!zapId || !durable?.transactionB64 || !durable?.nonceAccountId) {
                throw new Error("Backend did not return zap or durable tx");
            }
            const { transactionB64, nonceAccountId } = durable;

            console.log("calling sign transaction api");
            const txToSign = Transaction.from(Buffer.from(transactionB64, 'base64'));
            const signedTx = await signTransaction(txToSign);
            const signedTxB64 = Buffer.from(signedTx.serialize()).toString('base64');
            console.log("signedTxB64", signedTxB64);

            console.log("calling durable save api");    
            const saveRes = await axios.post(`${BACKEND_URL}/api/v1/durable/save`, {
                zapId,
                flowKey: "zap",
                nonceAccountId,
                feePayerPubkey: publicKey.toBase58(),
                transactionB64: signedTxB64,
                transfers,
                platformFeeLamports: 0,
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.log("saveRes", saveRes);
            // Stored for later submission
            setShowPaymentModal(false);
            router.push("/dashboard");
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
            const totalPayment = calculateTotalPayment(selectedActions);
            if (totalPayment > 0) {
                // Defer to payment modal flow which performs durable nonce build and save
                setShowPaymentModal(true);
                return;
            }

            // If no payment, just create the zap
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                zapName: zapName,
                availableTriggerId: selectedTrigger.id,
                triggerMetadata: selectedTrigger.metadata || {},
                actions: selectedActions.map(a => ({
                    availableActionId: a.availableActionId,
                    actionMetadata: a.metadata,
                })),
            }, { headers: { Authorization: `Bearer ${token}` } });

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
                    setSelectedTrigger({ id: selection.id, name: selection.name, metadata: selection.metadata });
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
                    zapName={zapName}
                    selectedTrigger={selectedTrigger}
                    selectedActions={selectedActions}
                    onZapNameChange={setZapName}
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
                    recipients={selectedActions
                        .filter(a => a.availableActionId === 'sol' && a.metadata?.address && a.metadata?.amount)
                        .map(a => ({
                            address: String(a.metadata.address),
                            amount: parseFloat(String(a.metadata.amount)) || 0,
                        }))}
                    onPay={handlePayment}
                    onCancel={() => setShowPaymentModal(false)}
                    isProcessing={isProcessingPayment}
                    isConnected={connected}
                />
            )}
        </>
    );
}



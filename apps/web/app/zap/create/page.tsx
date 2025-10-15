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

            const recipientPublicKey = new PublicKey(PAYMENT_PUBKEY);
            const lamports = Math.floor(totalAmount * LAMPORTS_PER_SOL);

            const unsignedTx = new Transaction();
            unsignedTx.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports,
                })
            );
            unsignedTx.feePayer = publicKey;
            // Placeholder blockhash; Gateway will replace it in buildGatewayTransaction
            unsignedTx.recentBlockhash = "11111111111111111111111111111111";

            const toBase64 = (bytes: Uint8Array) => {
                let binary = "";
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i] ?? 0);
                // btoa expects binary string
                return btoa(binary);
            };

            const fromBase64 = (b64: string): Uint8Array => {
                const binary = atob(b64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return bytes;
            };

            const GATEWAY_PROXY = "/api/gateway";

            const unsignedWireB64 = toBase64(
                unsignedTx.serialize({ requireAllSignatures: false, verifySignatures: false })
            );

            const buildResponse = await fetch(GATEWAY_PROXY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: "flowrge-build",
                    jsonrpc: "2.0",
                    method: "buildGatewayTransaction",
                    params: [
                        unsignedWireB64,
                        {
                            // We can pass options here if desired; using project defaults
                        },
                    ],
                }),
            });

            if (!buildResponse.ok) {
                throw new Error("Failed to build gateway transaction");
            }

            const buildJson = await buildResponse.json();
            const encodedBuiltTx: string | undefined = buildJson?.result?.transaction;
            if (!encodedBuiltTx) {
                throw new Error("Gateway did not return a transaction to sign");
            }

            const txToSign = Transaction.from(fromBase64(encodedBuiltTx));
            const signedTx = await signTransaction(txToSign);

            const signedWireB64 = toBase64(signedTx.serialize());

            const sendResponse = await fetch(GATEWAY_PROXY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: "flowrge-send",
                    jsonrpc: "2.0",
                    method: "sendTransaction",
                    params: [signedWireB64],
                }),
            });

            if (!sendResponse.ok) {
                throw new Error("Failed to send transaction via Gateway");
            }

            const sendJson = await sendResponse.json();
            const signature = sendJson?.result;
            if (!signature) {
                throw new Error("Gateway did not return a signature");
            }

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
                zapName: zapName,
                availableTriggerId: selectedTrigger.id,
                triggerMetadata: selectedTrigger.metadata || {},
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
                    onPay={handlePayment}
                    onCancel={() => setShowPaymentModal(false)}
                    isProcessing={isProcessingPayment}
                    isConnected={connected}
                />
            )}
        </>
    );
}



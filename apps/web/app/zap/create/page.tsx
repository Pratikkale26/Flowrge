"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { ZapCell } from "../../../components/ZapCell";
import { Input } from "../../../components/Input";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PAYMENT_PUBKEY = "FkUQR7H6FoNA4buay4qfXeVoxe31hz92gpsz5vEwbv5B";

// Defining types 
interface AvailableItem {
    id: string;
    name: string;
    image: string;
}

interface SelectedTrigger {
    id: string;
    name: string;
}

interface SelectedAction {
    // A unique key for React lists, separate from the visual index.
    key: number;
    visualIndex: number;
    availableActionId: string;
    availableActionName: string;
    metadata: any;
}

interface ModalSelection extends AvailableItem {
    metadata: any;
}

// Represents the state of the modal.
type ModalState = {
    isOpen: false;
} | {
    isOpen: true;
    type: 'trigger' | 'action';
    // The key of the action in the `selectedActions` array we're editing.
    actionKey?: number;
};


// --- CUSTOM HOOK ---
/**
 * Fetches available triggers and actions from the backend.
 * This hook encapsulates the data-fetching logic, including loading and error states.
 */
function useAvailableZapElements() {
    const [availableActions, setAvailableActions] = useState<AvailableItem[]>([]);
    const [availableTriggers, setAvailableTriggers] = useState<AvailableItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Using Promise.all to fetch both resources concurrently.
        // This is more efficient than firing two separate, unrelated requests.
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [triggersResponse, actionsResponse] = await Promise.all([
                    axios.get<{ availableTriggers: AvailableItem[] }>(`${BACKEND_URL}/api/v1/trigger/available`),
                    axios.get<{ availableActions: AvailableItem[] }>(`${BACKEND_URL}/api/v1/action/available`)
                ]);
                
                setAvailableTriggers(triggersResponse.data.availableTriggers || []);
                setAvailableActions(actionsResponse.data.availableActions || []);
            } catch (err) {
                console.error("Failed to fetch zap elements:", err);
                setError("Could not load required data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { availableActions, availableTriggers, isLoading, error };
}

// --- PAYMENT CALCULATION ---
function calculateTotalPayment(actions: SelectedAction[]): number {
    return actions.reduce((total, action) => {
        if (action.availableActionId === 'sol' && action.metadata?.amount) {
            return total + parseFloat(action.metadata.amount) || 0;
        }
        return total;
    }, 0);
}

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
            <header className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-foreground">Create Zap</h1>
                    {totalPayment > 0 && (
                        <div className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg text-sm font-medium">
                            Payment Required: {totalPayment} SOL
                        </div>
                    )}
                </div>
                <PrimaryButton onClick={handlePublishClick} >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                </PrimaryButton>
            </header>
            <main className="w-full min-h-screen bg-background flex flex-col items-center pt-10">
                <div className="space-y-4 flex flex-col items-center">
                    {/* Trigger Cell */}
                    <ZapCell
                        onClick={() => setModalState({ isOpen: true, type: 'trigger' })}
                        name={selectedTrigger?.name || "Choose Trigger"}
                        index={1}
                    />
                    
                    {/* Action Cells */}
                    {selectedActions.map(action => (
                        <ZapCell
                            key={action.key}
                            onClick={() => setModalState({ isOpen: true, type: 'action', actionKey: action.key })}
                            name={action.availableActionName || "Choose Action"}
                            index={action.visualIndex}
                        />
                    ))}

                    {/* Add Action Button */}
                    <div className="pt-2">
                        <button 
                            onClick={handleAddAction}
                            className="w-12 h-12 flex items-center justify-center bg-card/80 hover:bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xl font-medium text-muted-foreground hover:text-accent border border-border hover:border-accent/50 backdrop-blur-sm"
                            aria-label="Add Action"
                        >
                            +
                        </button>
                    </div>
                </div>
            </main>

            {modalState.isOpen && (
                <SelectionModal
                    onSelect={handleModalSelect}
                    // Determine which list of items to show based on the modal's context.
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

// --- MODAL AND CONFIGURATION SUB-COMPONENTS ---

// A map to associate action IDs with their specific configuration components.
// This is a scalable pattern; to support a new action, you just add an entry here.
const ACTION_CONFIG_COMPONENTS: Record<string, React.FC<{ setMetadata: (params: any) => void }>> = {
    'email': EmailSelector,
    'sol': SolanaSelector,
};

/**
 * Modal for selecting a trigger or an action. It can show a second step for configuration.
 */
function SelectionModal({ onSelect, availableItems = [], isTrigger }: {
    onSelect: (selection: ModalSelection | null) => void;
    availableItems?: AvailableItem[]; // Made optional and added default above
    isTrigger: boolean;
}) {
    const [step, setStep] = useState(0);
    const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);

    const handleItemClick = (item: AvailableItem) => {
        if (isTrigger || !ACTION_CONFIG_COMPONENTS[item.id]) {
            // If it's a trigger or an action with no extra config, select it immediately.
            onSelect({ ...item, metadata: {} });
        } else {
            // It's an action that needs configuration, so go to the next step.
            setSelectedItem(item);
            setStep(1);
        }
    };

    const handleMetadataSubmit = (metadata: any) => {
        if (selectedItem) {
            onSelect({ ...selectedItem, metadata });
        }
    };
    
    // The component to render for action configuration.
    const ConfigComponent = selectedItem ? ACTION_CONFIG_COMPONENTS[selectedItem.id] : null;

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

function PaymentModal({ 
    totalAmount, 
    onPay, 
    onCancel, 
    isProcessing, 
    isConnected 
}: { 
    totalAmount: number; 
    onPay: () => void; 
    onCancel: () => void; 
    isProcessing: boolean; 
    isConnected: boolean; 
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-md">
                <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border">
                    {/* Modal Header */}
                    <header className="flex items-center justify-between p-6 border-b border-border/50 rounded-t-2xl">
                        <h3 className="text-xl font-semibold text-foreground">Payment Required</h3>
                        <button onClick={onCancel} type="button" className="text-muted-foreground bg-transparent hover:bg-muted/50 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0-0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </header>
                    
                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">Complete Payment</h4>
                            <p className="text-muted-foreground mb-4">
                                To publish your Zap, you need to pay the cumulative SOL amount from all actions.
                            </p>
                            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                                <div className="text-2xl font-bold text-accent mb-1">{totalAmount} SOL</div>
                                <div className="text-sm text-muted-foreground">Total Payment Required</div>
                            </div>
                        </div>

                        {!isConnected && (
                            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                                <p className="text-destructive text-sm">
                                    Please connect your wallet to proceed with payment.
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-3 text-foreground bg-muted/50 hover:bg-muted rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onPay}
                                disabled={!isConnected || isProcessing}
                                className="flex-1 px-4 py-3 bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground rounded-xl transition-colors font-medium"
                            >
                                {isProcessing ? 'Processing...' : 'Pay & Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmailSelector({ setMetadata }: { setMetadata: (params: { email: string; subject:string; body: string }) => void }) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    const [subject, setSubject] = useState("");

    return (
        <div className="space-y-4">
            <Input label="To" type="email" placeholder="recipient@example.com" onChange={(e) => setEmail(e.target.value)} />
            <Input label="Subject" type="text" placeholder="Your subject here" onChange={(e) => setSubject(e.target.value)} />
            <Input label="Body" type="text" placeholder="Your message here" onChange={(e) => setBody(e.target.value)} />
            <div className="pt-2">
                <PrimaryButton onClick={() => setMetadata({ email, subject, body })}>
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}

function SolanaSelector({ setMetadata }: { setMetadata: (params: { amount: string; address: string }) => void }) {
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


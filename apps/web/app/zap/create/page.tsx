"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { ZapCell } from "../../../components/ZapCell";
import { Input } from "../../../components/Input";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

// --- MAIN PAGE COMPONENT ---
export default function CreateZapPage() {
    const router = useRouter();
    const { availableActions, availableTriggers, isLoading, error } = useAvailableZapElements();

    const [selectedTrigger, setSelectedTrigger] = useState<SelectedTrigger | null>(null);
    const [selectedActions, setSelectedActions] = useState<SelectedAction[]>([]);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);

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
        return <div className="min-h-screen bg-slate-200 flex justify-center items-center"><p>Loading...</p></div>;
    }
    
    if (error) {
        return <div className="min-h-screen bg-slate-200 flex justify-center items-center"><p className="text-red-500">{error}</p></div>;
    }

    return (
        <>
            <header className="flex justify-end bg-slate-200 p-4 border-b border-slate-300">
                <PrimaryButton onClick={handlePublish} >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                </PrimaryButton>
            </header>
            <main className="w-full min-h-screen bg-slate-200 flex flex-col items-center pt-10">
                <div className="space-y-2 flex flex-col items-center">
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
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors text-2xl font-light text-gray-600"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl">
                <div className="relative bg-white rounded-lg shadow">
                    {/* Modal Header */}
                    <header className="flex items-center justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {step === 0 ? `Select ${isTrigger ? "Trigger" : "Action"}` : `Configure: ${selectedItem?.name}`}
                        </h3>
                        <button onClick={() => onSelect(null)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0-0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </header>
                    {/* Modal Body */}
                    <div className="p-4 space-y-4">
                        {step === 0 && (
                            <div>
                                {availableItems.map((item) => (
                                    <div key={item.id} onClick={() => handleItemClick(item)} className="flex items-center gap-4 border p-4 cursor-pointer hover:bg-slate-100 rounded-lg mb-2">
                                        <img src={item.image} alt={item.name} width={30} height={30} className="rounded-full" />
                                        <span className="font-medium">{item.name}</span>
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

function EmailSelector({ setMetadata }: { setMetadata: (params: { email: string; body: string }) => void }) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    return (
        <div>
            <Input label="To" type="email" placeholder="recipient@example.com" onChange={(e) => setEmail(e.target.value)} />
            <Input label="Body" type="text" placeholder="Your message here" onChange={(e) => setBody(e.target.value)} />
            <div className="pt-2">
                <PrimaryButton onClick={() => setMetadata({ email, body })}>
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
        <div>
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


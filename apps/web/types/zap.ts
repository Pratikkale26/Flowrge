export interface AvailableItem {
    id: string;
    name: string;
    image: string;
}

export interface SelectedTrigger {
    id: string;
    name: string;
    metadata?: any;
}

export interface SelectedAction {
    // A unique key for React lists, separate from the visual index.
    key: number;
    visualIndex: number;
    availableActionId: string;
    availableActionName: string;
    metadata: any;
}

export interface ModalSelection extends AvailableItem {
    metadata: any;
}

// Represents the state of the modal.
export type ModalState = {
    isOpen: false;
} | {
    isOpen: true;
    type: 'trigger' | 'action';
    // The key of the action in the `selectedActions` array we're editing.
    actionKey?: number;
};

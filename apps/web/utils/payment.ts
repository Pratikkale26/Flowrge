interface SelectedAction {
    key: number;
    visualIndex: number;
    availableActionId: string;
    availableActionName: string;
    metadata: any;
}

/**
 * Calculates the total payment amount from all Solana actions
 */
export function calculateTotalPayment(actions: SelectedAction[]): number {
    return actions.reduce((total, action) => {
        if (action.availableActionId === 'sol' && action.metadata?.amount) {
            return total + parseFloat(action.metadata.amount) || 0;
        }
        return total;
    }, 0);
}

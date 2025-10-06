"use client";

interface PaymentModalProps {
    totalAmount: number;
    onPay: () => void;
    onCancel: () => void;
    isProcessing: boolean;
    isConnected: boolean;
}

export function PaymentModal({ 
    totalAmount, 
    onPay, 
    onCancel, 
    isProcessing, 
    isConnected 
}: PaymentModalProps) {
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

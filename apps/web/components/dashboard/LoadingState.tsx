"use client";

export function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="animate-pulse">
                <div className="h-8 bg-muted/20 rounded-lg w-1/3 mb-2"></div>
                <div className="h-4 bg-muted/20 rounded w-1/2"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card/50 border border-border rounded-xl p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-muted/20 rounded-lg"></div>
                            <div className="w-4 h-4 bg-muted/20 rounded"></div>
                            <div className="w-8 h-8 bg-muted/20 rounded-lg"></div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                            <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                        </div>
                        <div className="bg-muted/20 rounded-lg p-3 mb-4">
                            <div className="h-3 bg-muted/20 rounded w-full mb-1"></div>
                            <div className="h-3 bg-muted/20 rounded w-2/3"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-8 bg-muted/20 rounded w-24"></div>
                            <div className="w-6 h-6 bg-muted/20 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


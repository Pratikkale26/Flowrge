"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";

interface ZapDetails {
    id: string;
    name: string;
    triggerId: string;
    userId: number;
    actions: {
        id: string;
        zapId: string;
        actionId: string;
        sortingOrder: number;
        type: {
            id: string;
            name: string;
            image: string;
        };
    }[];
    trigger: {
        id: string;
        zapId: string;
        triggerId: string;
        type: {
            id: string;
            name: string;
            image: string;
        };
    };
    status: 'active' | 'inactive' | 'paused';
    lastExecuted?: string;
    executionCount: number;
    zapRuns: any[]
}

export default function ZapDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [zap, setZap] = useState<ZapDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchZapDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap/${params.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const zapData = response.data.zap ?? response.data;
                setZap(zapData);

                try {
                    const runResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap/${params.id}/zaprun`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    console.log(runResponse.data);
                    const zaprunData = runResponse.data;
                    zapData.executionCount = zaprunData.count;
                    zapData.zapRuns = zaprunData.zapRuns;

                } catch (err) {
                    console.error("Failed to fetch zapruns:", err);
                }
            } catch (err) {
                console.error("Failed to fetch zap details:", err);
                setError("Failed to load zap details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchZapDetails();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading zap details...</p>
                </div>
            </div>
        );
    }

    if (error || !zap) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Zap Not Found</h2>
                    <p className="text-muted-foreground mb-4">{error || "The zap you're looking for doesn't exist."}</p>
                    <PrimaryButton onClick={() => router.push("/dashboard")}>
                        Back to Dashboard
                    </PrimaryButton>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card/50 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Zap Details</h1>
                                <p className="text-lg text-muted-foreground">Name: {zap.name}</p>
                                <p className="text-muted-foreground">ID: {zap.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                zap.status === 'active' 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : zap.status === 'paused'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : 'bg-muted/10 text-muted-foreground'
                            }`}>
                                {zap.status && zap.status.charAt(0).toUpperCase() + zap.status.slice(1)}
                            </div>
                            <PrimaryButton onClick={() => router.push("/zap/create")}>
                                Edit Zap
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Workflow Visualization */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Workflow</h2>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-2">
                                        {zap.trigger && <img src={zap.trigger.type.image} alt={zap.trigger.type.name} className="w-8 h-8" />}
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{zap.trigger && zap.trigger.type.name}</p>
                                    <p className="text-xs text-muted-foreground">Trigger</p>
                                </div>
                                
                                {zap.actions && zap.actions.map((action, index) => (
                                    <div key={action.id} className="flex items-center">
                                        <div className="w-8 h-0.5 bg-border"></div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-2">
                                                <img src={action.type.image} alt={action.type.name} className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground">{action.type.name}</p>
                                            <p className="text-xs text-muted-foreground">Action {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Execution History */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        {/* zap excutions is zap run need to fetch from the database */}
                            <h2 className="text-lg font-semibold text-foreground mb-4">Executions History</h2>
                            <div className="space-y-3">
                                {zap.executionCount > 0 ? (
                                    // <div className="text-center py-8">
                                    //     <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                                    //         <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    //         </svg>
                                    //     </div>
                                    //     <p className="text-muted-foreground">Triggered History will appear here</p>
                                    // </div>
                                    <div className="space-y-3">
                                        {zap.zapRuns.map((run) => (
                                            <div 
                                                key={run.id} 
                                                className="flex items-center justify-between bg-card/70 hover:bg-card border border-border/50 rounded-lg p-3 transition-colors cursor-pointer"
                                            >
                                                <div className="flex flex-col">
                                                    {/* Run Name/ID */}
                                                    <span className="font-medium text-foreground text-sm">
                                                        {`Execution ID: ${run.id.slice(0, 8)}...`}
                                                    </span>
                                                    {/* Triggered Time */}
                                                    <span className="text-xs text-muted-foreground">
                                                        Triggered on {formatDate(run.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-muted/10 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-muted-foreground">No executions yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Executions</span>
                                    <span className="font-semibold text-foreground">{zap.executionCount}</span>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className={`font-semibold ${
                                        zap.status === 'active' ? 'text-green-500' : 
                                        zap.status === 'paused' ? 'text-yellow-500' : 
                                        'text-muted-foreground'
                                    }`}>
                                        {zap.status && zap.status.charAt(0).toUpperCase() + zap.status.slice(1)}
                                    </span>
                                </div> */}
                                {zap.lastExecuted && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Last Run</span>
                                        <span className="font-semibold text-foreground text-sm">
                                            {formatDate(zap.lastExecuted)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Webhook Info */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Webhook</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Webhook URL</label>
                                    <div className="bg-muted/30 rounded-lg p-3">
                                        <code className="text-xs text-foreground break-all">
                                            {`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/1/${zap.id}`}
                                        </code>
                                    </div>
                                </div>
                                <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOOKS_URL}/hooks/catch/1/${zap.id}`)} className="w-full text-sm bg-accent/10 hover:bg-accent/20 text-accent rounded-lg py-2 px-3 transition-colors">
                                    Copy URL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


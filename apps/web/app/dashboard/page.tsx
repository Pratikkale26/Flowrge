"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { ZapGrid } from "../../components/dashboard/ZapGrid";
import { LoadingState } from "../../components/dashboard/LoadingState";

interface Zap {
    "id": string,
    "name": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": `Bearer ` + localStorage.getItem("token")
            }
        })
            .then(res => {
                setZaps(res.data.zaps);
                setLoading(false)
            })
    }, []);

    return {
        loading, zaps
    }
}

export default function() {
    const { loading, zaps } = useZaps();
    const router = useRouter();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, []);

    const handleEditZap = (zapId: string) => {
        // TODO: Implement edit functionality
        console.log("Edit zap:", zapId);
    };

    const handleDeleteZap = (zapId: string) => {
        // TODO: Implement delete functionality
        console.log("Delete zap:", zapId);
    };

    const handleDuplicateZap = (zapId: string) => {
        // TODO: Implement duplicate functionality
        console.log("Duplicate zap:", zapId);
    };
    
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <DashboardHeader />
                {loading ? (
                    <LoadingState />
                ) : (
                    <ZapGrid 
                        zaps={zaps} 
                        onEdit={handleEditZap}
                        onDelete={handleDeleteZap}
                        onDuplicate={handleDuplicateZap}
                    />
                )}
            </div>
        </div>
    );
}

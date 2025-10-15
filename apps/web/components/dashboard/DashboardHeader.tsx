"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "../buttons/PrimaryButton";

export function DashboardHeader() {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Flows</h1>
                <p className="text-muted-foreground">Manage and monitor your automated workflows</p>
            </div>
            <PrimaryButton onClick={() => router.push("/zap/create")}>
                Create New Flow
            </PrimaryButton>
        </div>
    );
}

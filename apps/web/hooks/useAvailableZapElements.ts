import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AvailableItem {
    id: string;
    name: string;
    image: string;
}

/**
 * Fetches available triggers and actions from the backend.
 * This hook encapsulates the data-fetching logic, including loading and error states.
 */
export function useAvailableZapElements() {
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

"use client";

import { useState, useEffect } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import axios from "axios";

interface EmailSelectorProps {
    setMetadata: (params: { 
        email: string; 
        subject: string; 
        body: string; 
        connected: boolean;
        provider?: string;
    }) => void;
}

export function EmailSelector({ setMetadata }: EmailSelectorProps) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    const [subject, setSubject] = useState("");
    const [connected, setConnected] = useState(false);
    const [provider, setProvider] = useState<string>("");

    useEffect(() => {
        // Check if user has email connected
        checkEmailConnection();
    }, []);

    const checkEmailConnection = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.user?.emailAccessToken) {
                setConnected(true);
                setProvider(res.data.user.emailProvider || 'gmail');
            }
        } catch (error) {
            console.error('Failed to check email connection:', error);
        }
    };

    const handleConnectEmail = () => {
        // For now, we'll use Gmail OAuth
        const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/email/callback`;
        const scope = 'https://www.googleapis.com/auth/gmail.send';
        const state = Math.random().toString(36).substring(7);
        
        // Store state for verification
        localStorage.setItem('email_oauth_state', state);
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;
        
        // Open popup window
        const popup = window.open(authUrl, 'emailAuth', 'width=600,height=600,scrollbars=yes,resizable=yes');
        
        // Listen for OAuth completion
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'EMAIL_OAUTH_SUCCESS') {
                setConnected(true);
                setProvider('gmail');
                popup?.close();
                window.removeEventListener('message', handleMessage);
            }
        };
        
        window.addEventListener('message', handleMessage);
    };

    const handleDisconnect = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/email/disconnect`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setConnected(false);
            setProvider("");
        } catch (error) {
            console.error('Failed to disconnect email:', error);
        }
    };

    return (
        <div className="space-y-4">
            {/* Email Connection Status */}
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-zinc-200">Email Account</h3>
                        <p className="text-xs text-zinc-400">
                            {connected 
                                ? `Connected to ${provider?.toUpperCase()}` 
                                : "Not connected - emails will be sent from Flowrge"
                            }
                        </p>
                    </div>
                    <div>
                        {connected ? (
                            <button
                                onClick={handleDisconnect}
                                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                                Disconnect
                            </button>
                        ) : (
                            <button
                                onClick={handleConnectEmail}
                                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                                Connect Gmail
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Email Configuration */}
            <Input 
                label="To" 
                type="email" 
                placeholder="recipient@example.com" 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
                label="Subject" 
                type="text" 
                placeholder="Your subject here" 
                onChange={(e) => setSubject(e.target.value)} 
            />
            <Input 
                label="Body" 
                type="text" 
                placeholder="Your message here" 
                onChange={(e) => setBody(e.target.value)} 
            />
            
            <div className="pt-2">
                <PrimaryButton onClick={() => setMetadata({ email, subject, body, connected, provider })}>
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}

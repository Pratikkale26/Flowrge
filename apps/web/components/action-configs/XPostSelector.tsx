"use client";

import { useState, useEffect } from "react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import axios from "axios";

interface XPostSelectorProps {
    setMetadata: (params: { 
        content: string; 
        connected: boolean;
    }) => void;
}

export function XPostSelector({ setMetadata }: XPostSelectorProps) {
    const [content, setContent] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    // Check if already connected on mount
    useEffect(() => {
        const token = localStorage.getItem('x_access_token');
        if (token) {
            setIsConnected(true);
        }
    }, []);

    // Listen for successful connection from popup
    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'X_CONNECT_SUCCESS') {
                const token = localStorage.getItem('x_access_token');
                
                if (token) {
                    // Store tokens in database
                    await storeTokensInDatabase();
                    setIsConnected(true);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleConnectX = () => {
        const clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/x/callback`;
        const scope = 'tweet.read tweet.write users.read';
        const state = Math.random().toString(36).substring(7);
        
        // Store state for verification
        localStorage.setItem('x_oauth_state', state);
        
        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
        
        // Open popup window
        const popup = window.open(authUrl, 'xAuth', 'width=600,height=600,scrollbars=yes,resizable=yes');
        
        // The popup will handle the OAuth flow and notify us via postMessage
    };

    const storeTokensInDatabase = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/x/connect`, {
                accessToken: localStorage.getItem('x_access_token'),
                refreshToken: localStorage.getItem('x_refresh_token'),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status !== 200) {
                throw new Error('Failed to store X tokens');
            }

        } catch (error) {
            console.error('Failed to store X tokens:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/x/disconnect`, {
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            localStorage.removeItem('x_access_token');
            localStorage.removeItem('x_refresh_token');
            setIsConnected(false);
        } catch (error) {
            console.error('Failed to disconnect X account:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Post Content
                </label>
                <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    maxLength={280}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {content.length}/280 characters
                </p>
            </div>
            
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">X Account Connection</h4>
                
                {!isConnected ? (
                    <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                            Connect your X account to enable posting. We'll use OAuth 2.0 for secure authentication.
                        </p>
                        <SecondaryButton onClick={handleConnectX}>
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Connect X Account
                        </SecondaryButton>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-green-800 dark:text-green-200">X account connected successfully</span>
                        </div>
                        <SecondaryButton onClick={handleDisconnect}>
                            Disconnect X Account
                        </SecondaryButton>
                    </div>
                )}
            </div>
            
            <div className="pt-2">
                <PrimaryButton 
                    onClick={() => setMetadata({ 
                        content, 
                        connected: isConnected
                    })}
                    disabled={!content || !isConnected}
                >
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}

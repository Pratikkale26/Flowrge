"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function XCallbackPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                setStatus('error');
                setMessage('Authorization was denied or failed');
                return;
            }

            if (!code || !state) {
                setStatus('error');
                setMessage('Missing authorization code or state');
                return;
            }

            // Verify state parameter
            const storedState = localStorage.getItem('x_oauth_state');
            if (state !== storedState) {
                setStatus('error');
                setMessage('Invalid state parameter');
                return;
            }

            try {
                // Exchange code for tokens
                const response = await fetch('/api/auth/x/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                if (!response.ok) {
                    throw new Error('Failed to exchange code for tokens');
                }

                const data = await response.json();
                
                // Store tokens
                localStorage.setItem('x_access_token', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('x_refresh_token', data.refresh_token);
                }

                setStatus('success');
                setMessage('X account connected successfully! You can close this window.');

                // Notify parent window that connection was successful
                if (window.opener) {
                    window.opener.postMessage({ type: 'X_CONNECT_SUCCESS' }, window.location.origin);
                }

                // Close the popup window
                setTimeout(() => {
                    window.close();
                }, 2000);

            } catch (error) {
                console.error('X auth error:', error);
                setStatus('error');
                setMessage('Failed to connect X account');
            }
        };

        handleCallback();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Connecting to X...
                            </h2>
                            <p className="text-muted-foreground">
                                Please wait while we connect your X account.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Success!
                            </h2>
                            <p className="text-muted-foreground">
                                {message}
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Error
                            </h2>
                            <p className="text-muted-foreground">
                                {message}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

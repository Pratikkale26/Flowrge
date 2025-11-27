"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EmailCallbackPage() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                window.opener?.postMessage({ type: 'EMAIL_OAUTH_ERROR', error }, window.location.origin);
                window.close();
                return;
            }

            if (!code || !state) {
                console.error('Missing code or state parameter');
                window.opener?.postMessage({ type: 'EMAIL_OAUTH_ERROR', error: 'Missing parameters' }, window.location.origin);
                window.close();
                return;
            }

            // Verify state parameter
            const storedState = localStorage.getItem('email_oauth_state');
            if (state !== storedState) {
                console.error('Invalid state parameter');
                window.opener?.postMessage({ type: 'EMAIL_OAUTH_ERROR', error: 'Invalid state' }, window.location.origin);
                window.close();
                return;
            }

            try {
                // Exchange code for tokens
                const response = await fetch('/api/auth/email/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                if (!response.ok) {
                    throw new Error('Failed to exchange code for token');
                }

                const tokenData = await response.json();
                
                // Store tokens temporarily
                localStorage.setItem('email_access_token', tokenData.access_token);
                localStorage.setItem('email_refresh_token', tokenData.refresh_token);

                // Store tokens in database
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/email/connect`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            accessToken: tokenData.access_token,
                            refreshToken: tokenData.refresh_token,
                            provider: 'gmail',
                        }),
                    });
                }

                // Notify parent window
                window.opener?.postMessage({ type: 'EMAIL_OAUTH_SUCCESS' }, window.location.origin);
                window.close();
            } catch (error) {
                console.error('Token exchange error:', error);
                window.opener?.postMessage({ type: 'EMAIL_OAUTH_ERROR', error: 'Token exchange failed' }, window.location.origin);
                window.close();
            }
        };

        handleCallback();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-zinc-300">Connecting your email account...</p>
            </div>
        </div>
    );
}

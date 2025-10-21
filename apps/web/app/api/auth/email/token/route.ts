import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { code, state } = await request.json();

        if (!code || !state) {
            return NextResponse.json(
                { error: 'Missing code or state parameter' },
                { status: 400 }
            );
        }

        const clientId = process.env.GMAIL_CLIENT_ID;
        const clientSecret = process.env.GMAIL_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/email/callback`;

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'Gmail API credentials not configured' },
                { status: 500 }
            );
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json().catch(() => ({}));
            console.error('Gmail token exchange error:', {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorData,
                request: {
                    redirect_uri: redirectUri,
                    client_id: clientId ? '***' : 'missing',
                    code_present: !!code,
                    state_present: !!state
                }
            });
            return NextResponse.json(
                { 
                    error: 'Failed to exchange code for token',
                    details: errorData.error_description || 'Unknown error',
                    code: errorData.error
                },
                { status: 400 }
            );
        }

        const tokenData = await tokenResponse.json();

        return NextResponse.json({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
        });
    } catch (error) {
        console.error('Email token exchange error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

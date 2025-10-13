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

        const clientId = process.env.X_CLIENT_ID;
        const clientSecret = process.env.X_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/x/callback`;

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'X API credentials not configured' },
                { status: 500 }
            );
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: 'challenge', // In production, use PKCE properly
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('X token exchange error:', errorText);
            return NextResponse.json(
                { error: 'Failed to exchange code for token' },
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
        console.error('X auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { prisma } from "db/prisma";

interface XPostData {
    content: string;
    connected: boolean;
    userId: number; // We'll need to pass the user ID to get their stored tokens
}

export async function sendXPost(data: XPostData) {
    if (!data.connected) {
        throw new Error("X account not connected");
    }

    if (!data.content || data.content.trim().length === 0) {
        throw new Error("Post content cannot be empty");
    }

    if (data.content.length > 280) {
        throw new Error("Post content exceeds 280 character limit");
    }

    // Get user's stored X access token from database
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { 
            xAccessToken: true, 
            xRefreshToken: true 
        }
    });

    if (!user?.xAccessToken) {
        throw new Error("No X access token found for user. Please reconnect your X account.");
    }

    try {
        const response = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.xAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: data.content,
            }),
        });

        if (!response.ok) {
            // If token is expired, try to refresh it
            if (response.status === 401 && user.xRefreshToken) {
                const refreshedToken = await refreshXToken(user.xRefreshToken) as { access_token: string };
                
                // Update the user's token in database
                await prisma.user.update({
                    where: { id: data.userId },
                    data: { xAccessToken: refreshedToken.access_token }
                });

                // Retry the request with new token
                const retryResponse = await fetch('https://api.twitter.com/2/tweets', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${refreshedToken.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: data.content,
                    }),
                });

                if (!retryResponse.ok) {
                    const errorText = await retryResponse.text();
                    throw new Error(`Twitter API error: ${retryResponse.status} - ${errorText}`);
                }

                const result = await retryResponse.json();
                console.log("X post sent successfully:", result);
                return result;
            }

            const errorText = await response.text();
            throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("X post sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Failed to send X post:", error);
        throw error;
    }
}

async function refreshXToken(refreshToken: string) {
    const clientId = process.env.X_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error('X API credentials not configured');
    }
    
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh failed:', errorText);
        throw new Error(`Failed to refresh X token: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

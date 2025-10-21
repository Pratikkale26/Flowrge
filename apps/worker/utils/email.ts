import { Resend } from 'resend';
import { prisma } from 'db/prisma';

export const resend = new Resend(process.env.RESEND_API_KEY); 

interface EmailData {
  to: string;
  subject: string;
  text: string;
  connected: boolean;
  provider?: string;
  userId: number;
}

export const sendEmail = async ({ to, subject, text, connected, provider, userId }: EmailData) => {
  if (!text) {
    throw new Error("Text content must be provided.");
  }

  if (connected && provider === 'gmail') {
    // Use user's Gmail credentials
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          emailAccessToken: true, 
          emailRefreshToken: true 
        } as any
      });

      if (!user?.emailAccessToken) {
        throw new Error("No Gmail access token found for user. Please reconnect your Gmail account.");
      }

      // Send email via Gmail API
      const emailMessage = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        ``,
        text
      ].join('\n');

      const encodedMessage = Buffer.from(emailMessage).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.emailAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedMessage,
        }),
      });

      if (!response.ok) {
        // If token is expired, try to refresh it
        if (response.status === 401 && user.emailRefreshToken) {
          const refreshedToken = await refreshGmailToken(user.emailRefreshToken as unknown as string);
          
          // Update the user's token in database
          await prisma.user.update({
            where: { id: userId },
            data: { emailAccessToken: (refreshedToken as any).access_token }
          } as any);

          // Retry the request with new token
          const retryResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${(refreshedToken as any).access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw: encodedMessage,
            }),
          });

          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(`Gmail API error: ${retryResponse.status} - ${errorText}`);
          }

          console.log("Email sent successfully via Gmail");
          return;
        }

        const errorText = await response.text();
        throw new Error(`Gmail API error: ${response.status} - ${errorText}`);
      }

      console.log("Email sent successfully via Gmail");
      return;
    } catch (error) {
      console.error("Failed to send email via Gmail, falling back to Resend:", error);
      // Fall through to Resend fallback
    }
  }

  // Fallback to Resend (or use Resend if not connected)
  await resend.emails.send({
    from: "Flowrge <noreply@decentralwatch.kalehub.com>",
    to,
    subject,
    text,
  });
  
  console.log("Email sent successfully via Resend");
};

async function refreshGmailToken(refreshToken: string) {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Gmail API credentials not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail token refresh error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
import { Resend } from "resend"

export const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

type SendEmailParams = {
  to: string | string[]
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: SendEmailParams) {
  if (!text) {
    throw new Error("Text content must be provided.")
  }

  await resend.emails.send({
    from: "Flowrge <noreply@decentralwatch.kalehub.com>",
    to,
    subject,
    text,
  })
}



import { NextResponse } from "next/server"
import { sendEmail } from "../../../lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string = (body?.email || "").trim()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Confirmation to the user
    await sendEmail({
      to: email,
      subject: "Waitlist signup",
      text: "You have been added to the waitlist for Flowrge",
    })

    await sendEmail({
      to: "kalepratik7661@gmail.com",
      subject: "New Waitlist signup for Flowrge",
      text: "New waitlist signup: " + email,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


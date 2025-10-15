import { NextResponse } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "*";
const NETWORK = process.env.SANCTUM_NETWORK || "devnet"; // "mainnet" | "devnet"
const API_KEY = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders() as HeadersInit });
}

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json(
            { error: "SANCTUM_GATEWAY_API_KEY not configured" },
            { status: 500, headers: corsHeaders() as HeadersInit }
        );
    }

    let jsonBody: unknown;
    try {
        jsonBody = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400, headers: corsHeaders() as HeadersInit }
        );
    }

    const endpoint = `https://tpg.sanctum.so/v1/${NETWORK}?apiKey=${API_KEY}`;

    try {
        const upstream = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonBody),
            // No need for mode: 'cors' in server environment
        });

        const text = await upstream.text();
        // Try to pass through JSON if possible; otherwise return as text
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, {
                status: upstream.status,
                headers: corsHeaders() as HeadersInit,
            });
        } catch {
            return new NextResponse(text, {
                status: upstream.status,
                headers: { ...corsHeaders(), "Content-Type": upstream.headers.get("content-type") || "text/plain" } as HeadersInit,
            });
        }
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message || "Upstream request failed" },
            { status: 502, headers: corsHeaders() as HeadersInit }
        );
    }
}



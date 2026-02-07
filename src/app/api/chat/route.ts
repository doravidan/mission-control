import { NextResponse } from "next/server";

const GATEWAY_URL = "http://localhost:18789";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // Try to send message through OpenClaw Gateway
    // First, try the session message endpoint
    const res = await fetch(`${GATEWAY_URL}/api/sessions/main/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(30000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        response: data.response || data.message || JSON.stringify(data),
      });
    }

    // If that fails, try alternative endpoints
    const altRes = await fetch(`${GATEWAY_URL}/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (altRes.ok) {
      const data = await altRes.json();
      return NextResponse.json({
        response: data.response || data.choices?.[0]?.message?.content || JSON.stringify(data),
      });
    }

    return NextResponse.json({
      response: `⚠️ Gateway responded with ${res.status}. Chat API endpoint may not be available. Message was: "${message}"`,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      error: "Failed to connect to Gateway. Make sure it's running on port 18789.",
    });
  }
}

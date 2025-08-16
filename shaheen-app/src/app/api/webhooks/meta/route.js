// app/api/webhooks/meta/route.js

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");
  
    const VERIFY_TOKEN = "shaheenai123";
  
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // ✅ Respond with the challenge
      return new Response(challenge, { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }
  
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Webhook event:", body);
  
      // ✅ Always respond 200 quickly
      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (err) {
      console.error("Error handling webhook:", err);
      return new Response("Bad Request", { status: 400 });
    }
  }
  
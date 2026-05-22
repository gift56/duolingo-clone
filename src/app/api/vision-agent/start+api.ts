import { verifyClerkRequest } from "@/lib/stream-auth";
import { startVisionAgentSession } from "@/lib/vision-agent-server";

type StartAgentBody = {
  callId?: string;
  callType?: string;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyClerkRequest(request);
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as StartAgentBody;
    const callId = body.callId?.trim();
    const callType = body.callType?.trim() || "default";

    if (!callId) {
      return Response.json({ error: "callId is required" }, { status: 400 });
    }

    const session = await startVisionAgentSession({ callId, callType });

    return Response.json(
      {
        sessionId: session.session_id,
        callId: session.call_id,
        sessionStartedAt: session.session_started_at,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[vision-agent/start]", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start Vision Agent",
      },
      { status: 500 },
    );
  }
}

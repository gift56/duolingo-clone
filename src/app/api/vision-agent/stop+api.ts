import { verifyClerkRequest } from "@/lib/stream-auth";
import { stopVisionAgentSession } from "@/lib/vision-agent-server";

type StopAgentBody = {
  callId?: string;
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    const auth = await verifyClerkRequest(request);
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as StopAgentBody;
    const callId = body.callId?.trim();
    const sessionId = body.sessionId?.trim();

    if (!callId || !sessionId) {
      return Response.json(
        { error: "callId and sessionId are required" },
        { status: 400 },
      );
    }

    await stopVisionAgentSession({ callId, sessionId });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[vision-agent/stop]", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to stop Vision Agent",
      },
      { status: 500 },
    );
  }
}

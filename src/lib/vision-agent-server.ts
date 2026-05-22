import type {
  VisionAgentSessionResponse,
  VisionAgentStopResponse,
} from "@/types/stream";

function getVisionAgentBaseUrl(): string {
  const url = process.env.VISION_AGENT_URL?.trim();
  if (!url) {
    throw new Error("VISION_AGENT_URL must be set on the server");
  }
  return url.replace(/\/$/, "");
}

async function parseVisionAgentResponse<T>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & {
    detail?: string;
    error?: string;
  };

  if (!response.ok) {
    const message =
      (typeof body === "object" && body && "detail" in body && body.detail) ||
      (typeof body === "object" && body && "error" in body && body.error) ||
      fallbackError;
    throw new Error(String(message));
  }

  return body;
}

export async function startVisionAgentSession(params: {
  callId: string;
  callType: string;
}): Promise<VisionAgentSessionResponse> {
  const baseUrl = getVisionAgentBaseUrl();
  const response = await fetch(
    `${baseUrl}/calls/${encodeURIComponent(params.callId)}/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: params.callType }),
    },
  );

  return parseVisionAgentResponse<VisionAgentSessionResponse>(
    response,
    "Failed to start Vision Agent session",
  );
}

export async function stopVisionAgentSession(params: {
  callId: string;
  sessionId: string;
}): Promise<VisionAgentStopResponse> {
  const baseUrl = getVisionAgentBaseUrl();
  const response = await fetch(
    `${baseUrl}/calls/${encodeURIComponent(params.callId)}/sessions/${encodeURIComponent(params.sessionId)}`,
    { method: "DELETE" },
  );

  // Session may already be closed if the agent crashed during join.
  if (
    response.status === 202 ||
    response.status === 204 ||
    response.status === 404
  ) {
    return { ok: true };
  }

  return parseVisionAgentResponse<VisionAgentStopResponse>(
    response,
    "Failed to stop Vision Agent session",
  );
}

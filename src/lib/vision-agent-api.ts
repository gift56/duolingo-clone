import { getApiUrl } from "@/lib/api";
import type {
  VisionAgentStartRequest,
  VisionAgentStartResponse,
  VisionAgentStopRequest,
  VisionAgentStopResponse,
} from "@/types/stream";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(
      typeof body === "object" && body && "error" in body && body.error
        ? String(body.error)
        : `Request failed (${response.status})`,
    );
  }
  return body;
}

export async function startVisionAgent(
  clerkSessionToken: string,
  payload: VisionAgentStartRequest,
): Promise<VisionAgentStartResponse> {
  const response = await fetch(getApiUrl("/api/vision-agent/start"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<VisionAgentStartResponse>(response);
}

export async function stopVisionAgent(
  clerkSessionToken: string,
  payload: VisionAgentStopRequest,
): Promise<VisionAgentStopResponse> {
  const response = await fetch(getApiUrl("/api/vision-agent/stop"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<VisionAgentStopResponse>(response);
}

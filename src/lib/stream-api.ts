import { getApiUrl } from "@/lib/api";
import type {
  StreamCallResponse,
  StreamLessonCallCustomData,
  StreamTokenResponse,
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

export async function fetchStreamToken(
  clerkSessionToken: string,
  user: { name: string; imageUrl?: string },
): Promise<StreamTokenResponse> {
  const response = await fetch(getApiUrl("/api/stream/token"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return parseJsonResponse<StreamTokenResponse>(response);
}

export async function createStreamAudioCall(
  clerkSessionToken: string,
  payload: StreamLessonCallCustomData & { unitId: string },
): Promise<StreamCallResponse> {
  const response = await fetch(getApiUrl("/api/stream/call"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<StreamCallResponse>(response);
}

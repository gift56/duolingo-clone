import { StreamClient } from "@stream-io/node-sdk";

import type { StreamLessonCallCustomData } from "@/types/stream";

export const AUDIO_LESSON_CALL_TYPE = "audio_room";

let streamClient: StreamClient | null = null;

export function getStreamServerClient(): StreamClient {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set on the server");
  }

  if (!streamClient) {
    streamClient = new StreamClient(apiKey, apiSecret);
  }

  return streamClient;
}

export function buildLessonCallId(lessonId: string, clerkUserId: string): string {
  const safeUser = clerkUserId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `lesson-${lessonId}-${safeUser}`.slice(0, 64);
}

export async function upsertStreamUser(params: {
  userId: string;
  name: string;
  image?: string;
}) {
  const client = getStreamServerClient();
  await client.upsertUsers([
    {
      id: params.userId,
      name: params.name,
      image: params.image,
    },
  ]);
}

export function generateStreamVideoToken(userId: string): string {
  const client = getStreamServerClient();
  return client.generateUserToken({ user_id: userId });
}

export async function createAudioLessonCall(params: {
  callId: string;
  createdById: string;
  custom: StreamLessonCallCustomData;
}) {
  const client = getStreamServerClient();
  const call = client.video.call(AUDIO_LESSON_CALL_TYPE, params.callId);

  await call.getOrCreate({
    data: {
      created_by_id: params.createdById,
      custom: params.custom,
      members: [{ user_id: params.createdById, role: "admin" }],
      settings_override: {
        audio: { mic_default_on: true, default_device: "speaker" },
        video: { camera_default_on: false },
      },
    },
  });

  return {
    callType: AUDIO_LESSON_CALL_TYPE,
    callId: params.callId,
    callCid: call.cid,
  };
}

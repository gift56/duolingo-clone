export type LiveCaptionSpeaker = "teacher" | "user";

export type LiveCaptionPayload = {
  type: "live_caption";
  speaker: LiveCaptionSpeaker;
  text: string;
  is_partial: boolean;
};

export function isLiveCaptionPayload(
  value: unknown,
): value is LiveCaptionPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    payload.type === "live_caption" &&
    (payload.speaker === "teacher" || payload.speaker === "user") &&
    typeof payload.text === "string" &&
    typeof payload.is_partial === "boolean"
  );
}

export type StreamCallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "error"
  | "ended";

export type StreamTokenResponse = {
  apiKey: string;
  token: string;
  userId: string;
};

export type StreamCallResponse = {
  callType: string;
  callId: string;
  callCid: string;
};

export type VisionAgentStatus = "idle" | "connecting" | "connected" | "failed";

export type VisionAgentStartRequest = {
  callId: string;
  callType: string;
};

export type VisionAgentStopRequest = {
  callId: string;
  sessionId: string;
};

export type VisionAgentStartResponse = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

export type VisionAgentStopResponse = {
  ok: boolean;
};

/** Raw Vision Agent HTTP API response (server-side proxy only). */
export type VisionAgentSessionResponse = {
  session_id: string;
  call_id: string;
  session_started_at: string;
};

export type StreamLessonCallCustomData = {
  lessonId: string;
  lessonTitle: string;
  languageId: string;
  languageName: string;
  unitId: string;
  clerkUserId: string;
  userName: string;
  goals: string[];
  vocabulary: { word: string; translation: string }[];
  phrases: { text: string; translation: string }[];
  aiTeacher: {
    systemContext: string;
    openingLine: string;
    focusTopics: string[];
    level: string;
  };
};

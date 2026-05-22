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

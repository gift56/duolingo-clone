import { useAuth, useUser } from "@clerk/expo";
import {
  callManager,
  StreamVideoClient,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { createStreamAudioCall, fetchStreamToken } from "@/lib/stream-api";
import type { AudioLessonScreenData } from "@/lib/audio-lesson-data";
import type { StreamCallStatus } from "@/types/stream";

type UseStreamAudioLessonParams = {
  screenData: AudioLessonScreenData;
  unitId: string;
  enabled: boolean;
};

type UseStreamAudioLessonResult = {
  status: StreamCallStatus;
  errorMessage: string | null;
  client: StreamVideoClient | undefined;
  call: Call | undefined;
  micEnabled: boolean;
  participantCount: number;
  isConnecting: boolean;
  startCall: () => void;
  toggleMic: () => Promise<void>;
  endCall: () => Promise<void>;
  retry: () => void;
};

export function useStreamAudioLesson({
  screenData,
  unitId,
  enabled,
}: UseStreamAudioLessonParams): UseStreamAudioLessonResult {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  const [status, setStatus] = useState<StreamCallStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | undefined>();
  const [call, setCall] = useState<Call | undefined>();
  const [micEnabled, setMicEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [startNonce, setStartNonce] = useState(1);

  const activeRef = useRef(false);

  const userName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username ||
    "Learner";
  const userImageUrl = user?.imageUrl ?? undefined;

  const getClerkSessionToken = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("Sign in required to start an audio lesson.");
    }
    return token;
  }, [getToken]);

  const cleanupCall = useCallback(async (activeCall?: Call) => {
    const target = activeCall ?? call;
    callManager.stop();
    if (target) {
      try {
        await target.leave();
      } catch {
        // Call may already be left.
      }
    }
    setCall(undefined);
  }, [call]);

  const disconnectClient = useCallback(async (activeClient?: StreamVideoClient) => {
    const target = activeClient ?? client;
    if (target) {
      try {
        await target.disconnectUser();
      } catch {
        // Client may already be disconnected.
      }
    }
    setClient(undefined);
  }, [client]);

  useEffect(() => {
    if (!enabled || !isSignedIn || startNonce === 0) {
      return;
    }

    let cancelled = false;
    activeRef.current = true;

    async function connectAndJoin() {
      setErrorMessage(null);
      setStatus("loading");

      let videoClient: StreamVideoClient | undefined;
      let streamCall: Call | undefined;

      try {
        const clerkToken = await getClerkSessionToken();
        const tokenResponse = await fetchStreamToken(clerkToken, {
          name: userName,
          imageUrl: userImageUrl,
        });

        if (cancelled) return;

        const tokenProvider = async () => {
          const refreshed = await getClerkSessionToken();
          const refreshedToken = await fetchStreamToken(refreshed, {
            name: userName,
            imageUrl: userImageUrl,
          });
          return refreshedToken.token;
        };

        videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey: tokenResponse.apiKey,
          user: {
            id: tokenResponse.userId,
            name: userName,
            image: userImageUrl,
          },
          token: tokenResponse.token,
          tokenProvider,
        });

        setClient(videoClient);
        setStatus("connecting");

        const { lesson, language } = screenData;
        const callMeta = await createStreamAudioCall(clerkToken, {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          languageId: language.id,
          languageName: language.name,
          unitId,
          clerkUserId: tokenResponse.userId,
          userName,
          goals: lesson.goals.map((goal) => goal.description),
          vocabulary: lesson.vocabulary.map((item) => ({
            word: item.word,
            translation: item.translation,
          })),
          phrases: lesson.phrases.map((phrase) => ({
            text: phrase.text,
            translation: phrase.translation,
          })),
          aiTeacher: {
            systemContext: lesson.aiTeacher.systemContext,
            openingLine: lesson.aiTeacher.openingLine,
            focusTopics: lesson.aiTeacher.focusTopics,
            level: lesson.aiTeacher.level,
          },
        });

        if (cancelled) return;

        streamCall = videoClient.call(callMeta.callType, callMeta.callId);
        callManager.start({
          audioRole: "communicator",
          deviceEndpointType: "speaker",
        });

        await streamCall.join({ create: false });

        try {
          await streamCall.camera.disable();
        } catch {
          // Audio-only lesson — camera is optional.
        }

        try {
          await streamCall.microphone.enable();
          setMicEnabled(true);
        } catch (micError) {
          console.warn("Microphone enable failed:", micError);
          setMicEnabled(false);
        }

        if (cancelled) {
          await streamCall.leave().catch(() => undefined);
          return;
        }

        setCall(streamCall);
        setParticipantCount(streamCall.state.participants.length);
        setStatus("joined");
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Could not join audio lesson.";
        setErrorMessage(message);
        setStatus("error");
        await cleanupCall(streamCall);
        await disconnectClient(videoClient);
      }
    }

    connectAndJoin();

    return () => {
      cancelled = true;
      activeRef.current = false;
      cleanupCall();
      disconnectClient();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only when lesson/session restarts
  }, [enabled, isSignedIn, startNonce, unitId, screenData.lesson.id]);

  useEffect(() => {
    if (!call) return;

    const subscription = call.state.participants$.subscribe((participants) => {
      setParticipantCount(participants.length);
    });

    return () => subscription.unsubscribe();
  }, [call]);

  const startCall = useCallback(() => {
    setStartNonce((value) => value + 1);
  }, []);

  const toggleMic = useCallback(async () => {
    if (!call || status === "ended" || status === "error") {
      return;
    }

    try {
      if (micEnabled) {
        await call.microphone.disable();
        setMicEnabled(false);
        setStatus("muted");
      } else {
        await call.microphone.enable();
        setMicEnabled(true);
        setStatus("joined");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not toggle microphone.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [call, micEnabled, status]);

  const endCall = useCallback(async () => {
    setStatus("ended");
    setErrorMessage(null);
    await cleanupCall();
    await disconnectClient();
  }, [cleanupCall, disconnectClient]);

  const retry = useCallback(() => {
    setErrorMessage(null);
    setStatus("idle");
    setStartNonce((value) => value + 1);
  }, []);

  return {
    status,
    errorMessage,
    client,
    call,
    micEnabled,
    participantCount,
    isConnecting: status === "loading" || status === "connecting",
    startCall,
    toggleMic,
    endCall,
    retry,
  };
}

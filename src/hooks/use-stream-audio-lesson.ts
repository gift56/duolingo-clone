import { useAuth, useUser } from "@clerk/expo";
import { useFocusEffect } from "expo-router";
import {
  callManager,
  StreamVideoClient,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { createStreamAudioCall, fetchStreamToken } from "@/lib/stream-api";
import type { AudioLessonScreenData } from "@/lib/audio-lesson-data";
import { configureStreamLogBox } from "@/lib/stream-client-config";
import type { StreamCallStatus } from "@/types/stream";

type UseStreamAudioLessonParams = {
  screenData: AudioLessonScreenData;
  unitId: string;
  enabled: boolean;
};

export function useStreamAudioLesson({
  screenData,
  unitId,
  enabled,
}: UseStreamAudioLessonParams) {
  configureStreamLogBox();

  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  const [status, setStatus] = useState<StreamCallStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | undefined>();
  const [call, setCall] = useState<Call | undefined>();
  const [micEnabled, setMicEnabled] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [startNonce, setStartNonce] = useState(1);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [callId, setCallId] = useState<string | undefined>();
  const [callType, setCallType] = useState<string | undefined>();

  const callRef = useRef<Call | undefined>(undefined);
  const clientRef = useRef<StreamVideoClient | undefined>(undefined);
  const hasActiveSessionRef = useRef(false);
  const isDisconnectingRef = useRef(false);
  const callMediaStoppedRef = useRef(false);
  const isEndingCallRef = useRef(false);
  const screenDataRef = useRef(screenData);
  const unitIdRef = useRef(unitId);
  const getTokenRef = useRef(getToken);

  screenDataRef.current = screenData;
  unitIdRef.current = unitId;
  getTokenRef.current = getToken;

  const userName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username ||
    "Learner";
  const userImageUrl = user?.imageUrl ?? undefined;
  const userNameRef = useRef(userName);
  const userImageUrlRef = useRef(userImageUrl);
  userNameRef.current = userName;
  userImageUrlRef.current = userImageUrl;

  const stopLocalMedia = useCallback(async (activeCall?: Call) => {
    const target = activeCall ?? callRef.current;
    if (!target) return;

    try {
      await target.microphone.disable();
    } catch {
      // Mic may already be off.
    }
    try {
      await target.camera.disable();
    } catch {
      // Audio-only lesson.
    }
    setMicEnabled(false);
  }, []);

  const stopCallMedia = useCallback(async () => {
    if (callMediaStoppedRef.current) return;
    callMediaStoppedRef.current = true;

    const activeCall = callRef.current;

    // Mic must be fully off before leaving — otherwise Android Fabric crashes.
    await stopLocalMedia(activeCall);

    if (activeCall) {
      try {
        await activeCall.leave();
      } catch {
        // Already left.
      }
    }

    callManager.stop();
    hasActiveSessionRef.current = false;
  }, [stopLocalMedia]);

  const disconnectClient = useCallback(async () => {
    const activeClient = clientRef.current;
    if (!activeClient) return;

    try {
      await activeClient.disconnectUser();
    } catch {
      // Already disconnected.
    }

    clientRef.current = undefined;
    setClient(undefined);
  }, []);

  const leaveAndDisconnect = useCallback(async () => {
    if (isDisconnectingRef.current) return;
    isDisconnectingRef.current = true;

    try {
      await stopCallMedia();

      callRef.current = undefined;
      setCall(undefined);
      setCallId(undefined);
      setCallType(undefined);

      await disconnectClient();
    } finally {
      isDisconnectingRef.current = false;
    }
  }, [disconnectClient, stopCallMedia]);

  /** Ends the call but keeps Stream providers mounted until the screen unmounts. */
  const endCallSession = useCallback(async () => {
    if (isEndingCallRef.current || callMediaStoppedRef.current) return;

    isEndingCallRef.current = true;
    setIsEndingCall(true);
    setStatus("ended");
    setErrorMessage(null);

    try {
      await stopCallMedia();
    } finally {
      isEndingCallRef.current = false;
      setIsEndingCall(false);
    }
  }, [stopCallMedia]);

  useEffect(() => {
    if (!enabled || !isSignedIn || startNonce === 0) {
      return;
    }

    if (hasActiveSessionRef.current && callRef.current) {
      return;
    }

    let cancelled = false;

    async function connectAndJoin() {
      callMediaStoppedRef.current = false;
      isEndingCallRef.current = false;
      setErrorMessage(null);
      setStatus("connecting");

      let videoClient: StreamVideoClient | undefined;
      let streamCall: Call | undefined;

      try {
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Sign in required to start an audio lesson.");
        }
        if (cancelled) return;

        const tokenResponse = await fetchStreamToken(clerkToken, {
          name: userNameRef.current,
          imageUrl: userImageUrlRef.current,
        });
        if (cancelled) return;

        const tokenProvider = async () => {
          const refreshed = await getTokenRef.current();
          if (!refreshed) throw new Error("Session expired.");
          const refreshedToken = await fetchStreamToken(refreshed, {
            name: userNameRef.current,
            imageUrl: userImageUrlRef.current,
          });
          return refreshedToken.token;
        };

        videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey: tokenResponse.apiKey,
          user: {
            id: tokenResponse.userId,
            name: userNameRef.current,
            image: userImageUrlRef.current,
          },
          token: tokenResponse.token,
          tokenProvider,
        });

        clientRef.current = videoClient;
        setClient(videoClient);

        const { lesson, language } = screenDataRef.current;
        const callMeta = await createStreamAudioCall(clerkToken, {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          languageId: language.id,
          languageName: language.name,
          unitId: unitIdRef.current,
          clerkUserId: tokenResponse.userId,
          userName: userNameRef.current,
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
        callRef.current = streamCall;
        setCall(streamCall);
        setCallId(callMeta.callId);
        setCallType(callMeta.callType);

        callManager.start({
          audioRole: "communicator",
          deviceEndpointType: "speaker",
        });

        await streamCall.join({ create: true });

        if (cancelled) return;

        hasActiveSessionRef.current = true;
        setParticipantCount(streamCall.state.participants.length);
        setStatus("joined");

        try {
          await streamCall.camera.disable();
        } catch {
          // Audio-only lesson.
        }

        try {
          await streamCall.microphone.enable();
          if (!cancelled) setMicEnabled(true);
        } catch {
          if (!cancelled) setMicEnabled(false);
        }
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Could not join audio lesson.",
        );
        setStatus("error");
        hasActiveSessionRef.current = false;
        callMediaStoppedRef.current = true;
        if (streamCall) {
          await stopLocalMedia(streamCall);
          try {
            await streamCall.leave();
          } catch {
            // Ignore.
          }
        }
        callManager.stop();
        callRef.current = undefined;
        setCall(undefined);
        setCallId(undefined);
        setCallType(undefined);
        if (videoClient) {
          try {
            await videoClient.disconnectUser();
          } catch {
            // Ignore.
          }
        }
        clientRef.current = undefined;
        setClient(undefined);
      }
    }

    void connectAndJoin();

    return () => {
      cancelled = true;
    };
  }, [enabled, isSignedIn, startNonce, unitId, screenData.lesson.id, stopLocalMedia]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        void (async () => {
          if (isDisconnectingRef.current) return;
          isDisconnectingRef.current = true;

          try {
            await stopCallMedia();
            callRef.current = undefined;
            setCall(undefined);
            setCallId(undefined);
            setCallType(undefined);
            await disconnectClient();
          } finally {
            isDisconnectingRef.current = false;
          }
        })();
      };
    }, [disconnectClient, stopCallMedia]),
  );

  useEffect(() => {
    if (!call) return;
    const subscription = call.state.participants$.subscribe((participants) => {
      setParticipantCount(participants.length);
    });
    return () => subscription.unsubscribe();
  }, [call]);

  const toggleMic = useCallback(async () => {
    const activeCall = callRef.current;
    if (!activeCall || status === "ended" || status === "error") return;

    try {
      if (micEnabled) {
        await activeCall.microphone.disable();
        setMicEnabled(false);
        setStatus("muted");
      } else {
        await activeCall.microphone.enable();
        setMicEnabled(true);
        setStatus("joined");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not toggle microphone.",
      );
      setStatus("error");
    }
  }, [micEnabled, status]);

  const retry = useCallback(async () => {
    callMediaStoppedRef.current = false;
    isEndingCallRef.current = false;
    hasActiveSessionRef.current = false;
    await leaveAndDisconnect();
    setErrorMessage(null);
    setStartNonce((value) => value + 1);
  }, [leaveAndDisconnect]);

  return {
    status,
    errorMessage,
    client,
    call,
    callId,
    callType,
    micEnabled,
    participantCount,
    isConnecting: status === "connecting",
    isInCall: status === "joined" || status === "muted",
    isEndingCall,
    toggleMic,
    endCall: endCallSession,
    retry,
  };
}

import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

import { startVisionAgent, stopVisionAgent } from "@/lib/vision-agent-api";
import type { VisionAgentStatus } from "@/types/stream";

const AGENT_JOIN_TIMEOUT_MS = 25_000;

type UseVisionAgentParams = {
  callId?: string;
  callType?: string;
  enabled: boolean;
  /** Stream participants in the call (user + teacher = 2 when joined). */
  participantCount?: number;
};

function buildJoinFailureMessage(): string {
  return (
    "AI teacher did not join the call. Check that GOOGLE_API_KEY (or GEMINI_API_KEY) " +
    "is set, the vision-agent server is running, and Gemini API quota is available."
  );
}

export function useVisionAgent({
  callId,
  callType = "default",
  enabled,
  participantCount = 0,
}: UseVisionAgentParams) {
  const { getToken, isSignedIn } = useAuth();

  const [status, setStatus] = useState<VisionAgentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reconnectNonce, setReconnectNonce] = useState(0);

  const sessionIdRef = useRef<string | null>(null);
  const callIdRef = useRef<string | undefined>(callId);
  const callTypeRef = useRef(callType);
  const getTokenRef = useRef(getToken);
  const isStoppingRef = useRef(false);
  const joinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  callIdRef.current = callId;
  callTypeRef.current = callType;
  getTokenRef.current = getToken;
  sessionIdRef.current = sessionId;

  const clearJoinTimeout = useCallback(() => {
    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
    }
  }, []);

  const stopAgent = useCallback(async () => {
    clearJoinTimeout();

    const activeCallId = callIdRef.current;
    const activeSessionId = sessionIdRef.current;

    if (!activeCallId || !activeSessionId || isStoppingRef.current) {
      return;
    }

    isStoppingRef.current = true;

    try {
      const clerkToken = await getTokenRef.current();
      if (!clerkToken) return;

      await stopVisionAgent(clerkToken, {
        callId: activeCallId,
        sessionId: activeSessionId,
      });
    } catch {
      // Session may already be gone after a failed join.
    } finally {
      isStoppingRef.current = false;
      sessionIdRef.current = null;
      setSessionId(null);
      setStatus("idle");
      setErrorMessage(null);
    }
  }, [clearJoinTimeout]);

  useEffect(() => {
    if (!enabled || !isSignedIn || !callId) {
      return;
    }

    let cancelled = false;

    async function connectAgent() {
      setErrorMessage(null);
      setStatus("connecting");

      try {
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Sign in required to connect the AI teacher.");
        }
        if (cancelled) return;

        const response = await startVisionAgent(clerkToken, {
          callId: callIdRef.current!,
          callType: callTypeRef.current,
        });
        if (cancelled) return;

        sessionIdRef.current = response.sessionId;
        setSessionId(response.sessionId);
        // Stay "connecting" until the teacher appears in the Stream call.

        joinTimeoutRef.current = setTimeout(() => {
          if (cancelled) return;
          setStatus((current) => {
            if (current !== "connecting") return current;
            setErrorMessage(buildJoinFailureMessage());
            return "failed";
          });
        }, AGENT_JOIN_TIMEOUT_MS);
      } catch (error) {
        if (cancelled) return;
        clearJoinTimeout();
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not connect the AI teacher.",
        );
        setStatus("failed");
        sessionIdRef.current = null;
        setSessionId(null);
      }
    }

    void connectAgent();

    return () => {
      cancelled = true;
      void stopAgent();
    };
  }, [
    callId,
    callType,
    clearJoinTimeout,
    enabled,
    isSignedIn,
    reconnectNonce,
    stopAgent,
  ]);

  useEffect(() => {
    if (status !== "connecting" || !sessionIdRef.current) return;

    if (participantCount >= 2) {
      clearJoinTimeout();
      setErrorMessage(null);
      setStatus("connected");
    }
  }, [clearJoinTimeout, participantCount, status]);

  const retry = useCallback(async () => {
    clearJoinTimeout();
    await stopAgent();
    setReconnectNonce((value) => value + 1);
  }, [clearJoinTimeout, stopAgent]);

  useEffect(() => {
    return () => {
      void stopAgent();
    };
  }, [stopAgent]);

  return {
    status,
    errorMessage,
    sessionId,
    isConnecting: status === "connecting",
    isConnected: status === "connected",
    stopAgent,
    retry,
  };
}

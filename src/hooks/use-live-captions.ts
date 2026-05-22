import type { Call } from "@stream-io/video-react-native-sdk";
import { useEffect, useMemo, useState } from "react";

import {
  isLiveCaptionPayload,
  type LiveCaptionSpeaker,
} from "@/types/live-caption";

type CaptionLine = {
  text: string;
  isPartial: boolean;
};

type LiveCaptionDisplay = {
  speaker: LiveCaptionSpeaker;
  primary: string;
  secondary: string;
  isPartial: boolean;
};

type UseLiveCaptionsParams = {
  call?: Call;
  enabled: boolean;
};

const EMPTY_LINE: CaptionLine = { text: "", isPartial: false };

export function useLiveCaptions({ call, enabled }: UseLiveCaptionsParams) {
  const [teacher, setTeacher] = useState<CaptionLine>(EMPTY_LINE);
  const [user, setUser] = useState<CaptionLine>(EMPTY_LINE);
  const [activeSpeaker, setActiveSpeaker] =
    useState<LiveCaptionSpeaker | null>(null);

  useEffect(() => {
    if (!call || !enabled) {
      setTeacher(EMPTY_LINE);
      setUser(EMPTY_LINE);
      setActiveSpeaker(null);
      return;
    }

    const unsubscribe = call.on("custom", (event) => {
      const payload = event.custom;
      if (!isLiveCaptionPayload(payload)) return;

      const line = { text: payload.text, isPartial: payload.is_partial };
      if (payload.speaker === "teacher") {
        setTeacher(line);
      } else {
        setUser(line);
      }
      setActiveSpeaker(payload.speaker);
    });

    return () => {
      unsubscribe();
    };
  }, [call, enabled]);

  const display = useMemo((): LiveCaptionDisplay | null => {
    if (!enabled) return null;

    if (activeSpeaker === "user" && user.text) {
      return {
        speaker: "user",
        primary: user.text,
        secondary: "You",
        isPartial: user.isPartial,
      };
    }

    if (activeSpeaker === "teacher" && teacher.text) {
      return {
        speaker: "teacher",
        primary: teacher.text,
        secondary: "",
        isPartial: teacher.isPartial,
      };
    }

    if (teacher.text) {
      return {
        speaker: "teacher",
        primary: teacher.text,
        secondary: "",
        isPartial: teacher.isPartial,
      };
    }

    if (user.text) {
      return {
        speaker: "user",
        primary: user.text,
        secondary: "You",
        isPartial: user.isPartial,
      };
    }

    return null;
  }, [activeSpeaker, enabled, teacher, user]);

  const hasLiveCaption = Boolean(display?.primary);

  return {
    display,
    hasLiveCaption,
    activeSpeaker,
  };
}

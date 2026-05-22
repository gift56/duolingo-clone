import { useAuth, useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StreamCall,
  StreamVideo,
} from "@stream-io/video-react-native-sdk";

import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { AudioLessonFeedbackCard } from "@/components/audio-lesson/audio-lesson-feedback-card";
import { AudioLessonHeader } from "@/components/audio-lesson/audio-lesson-header";
import { AudioLessonStage } from "@/components/audio-lesson/audio-lesson-stage";
import { LessonEmbeddedTabBar } from "@/components/audio-lesson/lesson-embedded-tab-bar";
import { useStreamAudioLesson } from "@/hooks/use-stream-audio-lesson";
import {
  buildAudioLessonScreenData,
  getPhraseAtIndex,
} from "@/lib/audio-lesson-data";
import { useProgressStore } from "@/store/progress-store";

export default function AudioLessonScreen() {
  const router = useRouter();
  const { unitId, lessonId } = useLocalSearchParams<{
    unitId: string;
    lessonId: string;
  }>();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const streak = useProgressStore((state) => state.streak);

  const screenData = useMemo(() => {
    if (!lessonId) return null;
    return buildAudioLessonScreenData(lessonId);
  }, [lessonId]);

  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isLeavingLesson, setIsLeavingLesson] = useState(false);
  const streamShellMountedRef = useRef(false);
  const isLeavingLessonRef = useRef(false);

  const stream = useStreamAudioLesson({
    screenData: screenData!,
    unitId: unitId ?? "",
    enabled: Boolean(screenData && isSignedIn && unitId),
  });

  if (stream.client && !streamShellMountedRef.current) {
    streamShellMountedRef.current = true;
  }

  const userName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username ||
    "Learner";

  if (!screenData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body-medium text-text-secondary">
            Lesson not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body-medium text-center text-text-secondary">
            Sign in to start an audio lesson with your AI teacher.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { sessionSubtitle, teacherBubble, phraseQueue, feedback, focusLabel } =
    screenData;

  const activeBubble =
    phraseIndex === 0
      ? teacherBubble
      : getPhraseAtIndex(phraseQueue, phraseIndex - 1);

  const handleToggleSubtitles = () => {
    setSubtitlesEnabled((prev) => !prev);
    if (phraseQueue.length > 0) {
      setPhraseIndex((prev) => (prev + 1) % (phraseQueue.length + 1));
    }
  };

  const handleLeaveLesson = () => {
    if (isLeavingLessonRef.current) return;
    isLeavingLessonRef.current = true;
    setIsLeavingLesson(true);

    void (async () => {
      try {
        await stream.endCall();
        // Give native audio/WebRTC one frame to settle before navigating away.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
        router.back();
      } finally {
        isLeavingLessonRef.current = false;
        setIsLeavingLesson(false);
      }
    })();
  };

  const controlsDisabled = isLeavingLesson || stream.isEndingCall;

  const lessonBody = (
    <>
      <AudioLessonHeader
        sessionSubtitle={sessionSubtitle}
        streak={streak}
        callStatus={stream.status}
        callErrorMessage={stream.errorMessage}
        participantCount={stream.participantCount}
        userName={userName}
        onBack={handleLeaveLesson}
      />

      <View className="min-h-0 flex-1">
        {stream.status === "error" ? (
          <View className="mx-4 mb-3 items-center rounded-2xl border border-border bg-surface px-4 py-4">
            <Text
              className="text-text-primary text-center"
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}
            >
              Could not connect
            </Text>
            {stream.errorMessage ? (
              <Text className="text-body-small mt-2 text-center text-error">
                {stream.errorMessage}
              </Text>
            ) : null}
            <Pressable
              onPress={() => {
                void stream.retry();
              }}
              className="mt-4 rounded-full bg-primary px-6 py-3 active:opacity-85"
            >
              <Text
                className="text-white"
                style={{ fontFamily: "Poppins-SemiBold", fontSize: 15 }}
              >
                Try again
              </Text>
            </Pressable>
          </View>
        ) : null}

        <AudioLessonStage
          primaryText={activeBubble.primary}
          secondaryText={activeBubble.secondary}
          subtitlesEnabled={subtitlesEnabled}
          isConnecting={stream.isConnecting}
          isInCall={stream.isInCall}
          onReplaySpeech={() => setPhraseIndex(0)}
        />

        <AudioLessonControls
          micEnabled={stream.micEnabled}
          subtitlesEnabled={subtitlesEnabled}
          micDisabled={!stream.isInCall || controlsDisabled}
          endCallDisabled={controlsDisabled}
          onToggleMic={() => {
            void stream.toggleMic();
          }}
          onToggleSubtitles={handleToggleSubtitles}
          onEndCall={handleLeaveLesson}
        />

        <AudioLessonFeedbackCard ratings={feedback} focusLabel={focusLabel} />
      </View>

      <LessonEmbeddedTabBar activeTab="learn" />
    </>
  );

  const streamClient = stream.client;
  const streamCall = stream.call;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {streamShellMountedRef.current && streamClient && streamCall ? (
        <StreamVideo client={streamClient}>
          <StreamCall call={streamCall}>{lessonBody}</StreamCall>
        </StreamVideo>
      ) : (
        lessonBody
      )}
    </SafeAreaView>
  );
}

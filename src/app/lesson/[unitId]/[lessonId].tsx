import { useAuth, useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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
import type { StreamCallStatus } from "@/types/stream";

function getPreviewStatusLabel(status: StreamCallStatus): string {
  switch (status) {
    case "joined":
      return "Live";
    case "muted":
      return "Muted";
    case "connecting":
    case "loading":
      return "Connecting";
    case "error":
      return "Offline";
    case "ended":
      return "Ended";
    default:
      return "Ready";
  }
}

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
  const [showUserPreview, setShowUserPreview] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const stream = useStreamAudioLesson({
    screenData: screenData!,
    unitId: unitId ?? "",
    enabled: Boolean(screenData && isSignedIn && unitId),
  });

  const userName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username ||
    "Learner";
  const userImageUrl = user?.imageUrl ?? undefined;

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

  const handleEndCall = async () => {
    await stream.endCall();
    router.back();
  };

  const lessonBody = (
    <>
      <AudioLessonHeader
        sessionSubtitle={sessionSubtitle}
        streak={streak}
        callStatus={stream.status}
        callErrorMessage={stream.errorMessage}
        participantCount={stream.participantCount}
        userName={userName}
        onBack={() => {
          void stream.endCall();
          router.back();
        }}
      />

      <View className="min-h-0 flex-1">
        {stream.status === "idle" || stream.status === "error" ? (
          <View className="mx-4 mb-3 items-center rounded-2xl border border-border bg-surface px-4 py-4">
            <Text
              className="text-text-primary text-center"
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}
            >
              {stream.status === "error"
                ? "Could not connect to the audio lesson"
                : "Start your audio lesson"}
            </Text>
            {stream.errorMessage ? (
              <Text className="text-body-small mt-2 text-center text-error">
                {stream.errorMessage}
              </Text>
            ) : null}
            <Pressable
              onPress={
                stream.status === "error" ? stream.retry : stream.startCall
              }
              className="mt-4 rounded-full bg-primary px-6 py-3 active:opacity-85"
            >
              <Text
                className="text-white"
                style={{ fontFamily: "Poppins-SemiBold", fontSize: 15 }}
              >
                {stream.status === "error" ? "Try again" : "Start call"}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <AudioLessonStage
          primaryText={activeBubble.primary}
          secondaryText={activeBubble.secondary}
          subtitlesEnabled={subtitlesEnabled}
          showUserPreview={showUserPreview}
          userName={userName}
          userImageUrl={userImageUrl}
          callStatusLabel={getPreviewStatusLabel(stream.status)}
          isConnecting={stream.isConnecting}
          onReplaySpeech={() => {
            setPhraseIndex(0);
          }}
        />

        <AudioLessonControls
          micEnabled={stream.micEnabled}
          subtitlesEnabled={subtitlesEnabled}
          disabled={stream.isConnecting || stream.status === "ended"}
          onToggleCamera={() => setShowUserPreview((prev) => !prev)}
          onToggleMic={() => {
            void stream.toggleMic();
          }}
          onToggleSubtitles={handleToggleSubtitles}
          onEndCall={() => {
            void handleEndCall();
          }}
        />

        <AudioLessonFeedbackCard ratings={feedback} focusLabel={focusLabel} />
      </View>

      <LessonEmbeddedTabBar activeTab="learn" />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {!stream.client ? (
        lessonBody
      ) : (
        <StreamVideo client={stream.client}>
          {stream.call ? (
            <StreamCall call={stream.call}>{lessonBody}</StreamCall>
          ) : (
            lessonBody
          )}
        </StreamVideo>
      )}

      {stream.isConnecting ? (
        <View className="pointer-events-none absolute inset-0 items-center justify-center">
          <ActivityIndicator size="large" color="#6C4EF5" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

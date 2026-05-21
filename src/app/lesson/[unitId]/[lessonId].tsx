import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { AudioLessonFeedbackCard } from "@/components/audio-lesson/audio-lesson-feedback-card";
import { AudioLessonHeader } from "@/components/audio-lesson/audio-lesson-header";
import { AudioLessonStage } from "@/components/audio-lesson/audio-lesson-stage";
import { LessonEmbeddedTabBar } from "@/components/audio-lesson/lesson-embedded-tab-bar";
import {
  buildAudioLessonScreenData,
  getPhraseAtIndex,
} from "@/lib/audio-lesson-data";
import { useProgressStore } from "@/store/progress-store";

export default function AudioLessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ unitId: string; lessonId: string }>();

  const streak = useProgressStore((state) => state.streak);

  const screenData = useMemo(() => {
    if (!lessonId) return null;
    return buildAudioLessonScreenData(lessonId);
  }, [lessonId]);

  const [micEnabled, setMicEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [showUserPreview, setShowUserPreview] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <AudioLessonHeader
        sessionSubtitle={sessionSubtitle}
        streak={streak}
        onBack={() => router.back()}
      />

      <View className="min-h-0 flex-1">
        <AudioLessonStage
          primaryText={activeBubble.primary}
          secondaryText={activeBubble.secondary}
          subtitlesEnabled={subtitlesEnabled}
          showUserPreview={showUserPreview}
          onReplaySpeech={() => {
            setPhraseIndex(0);
          }}
        />

        <AudioLessonControls
          micEnabled={micEnabled}
          subtitlesEnabled={subtitlesEnabled}
          onToggleCamera={() => setShowUserPreview((prev) => !prev)}
          onToggleMic={() => setMicEnabled((prev) => !prev)}
          onToggleSubtitles={handleToggleSubtitles}
          onEndCall={() => router.back()}
        />

        <AudioLessonFeedbackCard ratings={feedback} focusLabel={focusLabel} />
      </View>

      <LessonEmbeddedTabBar activeTab="learn" />
    </SafeAreaView>
  );
}

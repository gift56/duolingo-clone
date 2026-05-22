import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { AudioLessonAgentStatus } from "@/components/audio-lesson/audio-lesson-agent-status";
import { AudioLessonSessionStatus } from "@/components/audio-lesson/audio-lesson-session-status";
import { images } from "@/constants/images";
import type { StreamCallStatus, VisionAgentStatus } from "@/types/stream";

type AudioLessonHeaderProps = {
  sessionSubtitle: string;
  streak: number;
  callStatus: StreamCallStatus;
  callErrorMessage?: string | null;
  agentStatus: VisionAgentStatus;
  agentErrorMessage?: string | null;
  participantCount?: number;
  userName?: string;
  onBack: () => void;
};

export function AudioLessonHeader({
  sessionSubtitle,
  streak,
  callStatus,
  callErrorMessage,
  agentStatus,
  agentErrorMessage,
  participantCount,
  userName,
  onBack,
}: AudioLessonHeaderProps) {
  return (
    <View className="flex-row items-center px-4 pb-2 pt-1">
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="h-10 w-10 items-center justify-center active:opacity-70"
      >
        <Ionicons name="chevron-back" size={24} color="#0D132B" />
      </Pressable>

      <View className="flex-1 items-center px-2">
        <Text
          className="text-text-primary"
          style={{ fontFamily: "Poppins-Bold", fontSize: 20, lineHeight: 26 }}
        >
          AI Teacher
        </Text>
        <AudioLessonSessionStatus
          status={callStatus}
          errorMessage={callErrorMessage}
          participantCount={participantCount}
        />
        <View className="mt-1">
          <AudioLessonAgentStatus
            status={agentStatus}
            errorMessage={agentErrorMessage}
          />
        </View>
        <Text
          className="text-caption mt-0.5 text-center text-text-secondary"
          numberOfLines={1}
        >
          {sessionSubtitle}
        </Text>
        {userName ? (
          <Text className="text-caption mt-0.5 text-center text-text-secondary">
            {userName}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-9 min-w-9 flex-row items-center justify-center rounded-full border border-border bg-white px-2">
          <Image
            source={images.streakFire}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />
          <Text
            className="ml-1 text-text-primary"
            style={{ fontFamily: "Poppins-Bold", fontSize: 14 }}
          >
            {streak}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          className="h-9 w-9 items-center justify-center active:opacity-70"
        >
          <Ionicons name="notifications-outline" size={22} color="#0D132B" />
        </Pressable>
      </View>
    </View>
  );
}

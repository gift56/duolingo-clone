import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";

type AudioLessonHeaderProps = {
  sessionSubtitle: string;
  streak: number;
  onBack: () => void;
};

export function AudioLessonHeader({
  sessionSubtitle,
  streak,
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
        <View className="mt-0.5 flex-row items-center">
          <View className="mr-1.5 h-2 w-2 rounded-full bg-success" />
          <Text className="text-body-small text-text-secondary">Online</Text>
        </View>
        <Text
          className="text-caption mt-0.5 text-center text-text-secondary"
          numberOfLines={1}
        >
          {sessionSubtitle}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Camera preview"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white active:opacity-70"
        >
          <Ionicons name="videocam-outline" size={18} color="#0D132B" />
        </Pressable>

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

import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { images } from "@/constants/images";

type AudioLessonStageProps = {
  primaryText: string;
  secondaryText: string;
  subtitlesEnabled: boolean;
  isConnecting?: boolean;
  isInCall?: boolean;
  captionIsPartial?: boolean;
  activeSpeaker?: "teacher" | "user";
  onReplaySpeech?: () => void;
};

export function AudioLessonStage({
  primaryText,
  secondaryText,
  subtitlesEnabled,
  isConnecting = false,
  isInCall = false,
  captionIsPartial = false,
  activeSpeaker,
  onReplaySpeech,
}: AudioLessonStageProps) {
  const showLiveIndicator = isInCall && !isConnecting;
  const indicatorColor =
    activeSpeaker === "user"
      ? "#4D8BFF"
      : captionIsPartial
        ? "#F5A623"
        : "#21C16B";

  return (
    <View className="mx-4 flex-1 overflow-hidden rounded-3xl">
      <Image
        source={images.audioLessonBackground}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={Platform.OS === "web" ? 0 : 6}
      />
      <View style={StyleSheet.absoluteFill} className="bg-black/20" />

      <View className="flex-1 items-center justify-end px-4 pb-3">
        <Image
          source={images.mascotWelcome}
          style={{ width: 220, height: 220, opacity: isConnecting ? 0.85 : 1 }}
          contentFit="contain"
        />

        <View style={styles.speechBubble} className="w-full px-1">
          {isConnecting ? (
            <View className="items-center py-2">
              <View style={styles.bubbleLoaderBackdrop} className="items-center px-4 py-3">
                <ActivityIndicator size="small" color="#6C4EF5" />
                <Text
                  className="mt-2 text-text-primary"
                  style={{ fontFamily: "Poppins-SemiBold", fontSize: 15 }}
                >
                  Connecting…
                </Text>
                <Text
                  className="text-text-primary mt-1"
                  style={{ fontFamily: "Poppins-Bold", fontSize: 18 }}
                >
                  {primaryText}
                </Text>
                {subtitlesEnabled ? (
                  <Text className="text-body-small mt-0.5 text-text-secondary">
                    {secondaryText}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center">
                  <Text
                    className="text-text-primary"
                    style={{ fontFamily: "Poppins-Bold", fontSize: 18, lineHeight: 24 }}
                  >
                    {primaryText}
                  </Text>
                  {showLiveIndicator ? (
                    <View
                      className="ml-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: indicatorColor }}
                    />
                  ) : null}
                </View>
                {subtitlesEnabled ? (
                  <Text className="text-body-medium mt-1 text-text-secondary">
                    {secondaryText}
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={onReplaySpeech}
                accessibilityRole="button"
                accessibilityLabel="Replay teacher audio"
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F3F0FF] active:opacity-80"
              >
                <Ionicons name="volume-medium" size={20} color="#6C4EF5" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleLoaderBackdrop: {
    backgroundColor: "rgba(13, 19, 43, 0.08)",
    borderRadius: 14,
    width: "100%",
  },
  speechBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: -8,
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
});

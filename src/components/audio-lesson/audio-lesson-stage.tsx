import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";

type AudioLessonStageProps = {
  primaryText: string;
  secondaryText: string;
  subtitlesEnabled: boolean;
  showUserPreview: boolean;
  userName?: string;
  userImageUrl?: string;
  callStatusLabel?: string;
  isConnecting?: boolean;
  onReplaySpeech?: () => void;
};

export function AudioLessonStage({
  primaryText,
  secondaryText,
  subtitlesEnabled,
  showUserPreview,
  userName,
  userImageUrl,
  callStatusLabel,
  isConnecting = false,
  onReplaySpeech,
}: AudioLessonStageProps) {
  return (
    <View className="mx-4 flex-1 overflow-hidden rounded-3xl">
      <Image
        source={images.audioLessonBackground}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={Platform.OS === "web" ? 0 : 6}
      />
      <View
        style={StyleSheet.absoluteFill}
        className="bg-black/20"
      />

      {showUserPreview ? (
        <View
          className="absolute right-3 top-3 overflow-hidden rounded-xl border-2 border-white/90 bg-white"
          style={styles.userPreview}
        >
          <Image
            source={
              userImageUrl ? { uri: userImageUrl } : images.userLessonPreview
            }
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/55 px-2 py-1.5">
            <Text
              className="text-white"
              numberOfLines={1}
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 11 }}
            >
              {userName ?? "You"}
            </Text>
            {callStatusLabel ? (
              <Text className="text-[10px] text-white/85" numberOfLines={1}>
                {callStatusLabel}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {isConnecting ? (
        <View className="absolute inset-0 items-center justify-center bg-black/25">
          <View className="rounded-2xl bg-white/95 px-5 py-3">
            <Text
              className="text-text-primary"
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}
            >
              Joining audio lesson…
            </Text>
          </View>
        </View>
      ) : null}

      <View className="flex-1 items-center justify-end px-4 pb-3">
        <Image
          source={images.mascotWelcome}
          style={{ width: 220, height: 220 }}
          contentFit="contain"
        />

        <View style={styles.speechBubble} className="w-full px-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="text-text-primary"
                style={{ fontFamily: "Poppins-Bold", fontSize: 18, lineHeight: 24 }}
              >
                {primaryText}
              </Text>
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userPreview: {
    width: 88,
    height: 112,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
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

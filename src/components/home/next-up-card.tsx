import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";

type NextUpCardProps = {
  onStartCall?: () => void;
};

export function NextUpCard({ onStartCall }: NextUpCardProps) {
  return (
    <Pressable
      onPress={onStartCall}
      className="mt-5 overflow-hidden rounded-3xl active:opacity-95"
      accessibilityRole="button"
      accessibilityLabel="Start AI video call"
    >
      <View
        className="flex-row items-center px-5 py-5"
        style={{ backgroundColor: "#E8F9F0" }}
      >
        <View className="flex-1">
          <Text className="text-body-small text-text-secondary">Next up</Text>
          <Text
            className="mt-0.5 text-text-primary"
            style={{ fontFamily: "Poppins-Bold", fontSize: 22, lineHeight: 28 }}
          >
            AI Video Call
          </Text>
          <Text className="text-body-small mt-0.5 text-text-secondary">
            Practice speaking
          </Text>
        </View>

        <View className="relative">
          <Image
            source={{ uri: images.teacherAvatar }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 3,
              borderColor: "#FFFFFF",
            }}
            contentFit="cover"
          />
          <View
            className="absolute -right-1 bottom-0 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#21C16B" }}
          >
            <Ionicons name="videocam" size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

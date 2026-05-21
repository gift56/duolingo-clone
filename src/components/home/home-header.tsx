import { useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import type { Language } from "@/types/learning";

type HomeHeaderProps = {
  language: Language;
  greeting: string;
  streak: number;
};

export function HomeHeader({ language, greeting, streak }: HomeHeaderProps) {
  const { user } = useUser();
  const displayName =
    user?.firstName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "there";

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center">
        <Image
          source={{ uri: language.flag }}
          style={{ width: 36, height: 36, borderRadius: 18 }}
          contentFit="cover"
        />
        <Text className="text-h4 ml-2.5 text-text-primary">
          {greeting}, {displayName}! 👋
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center">
          <Image
            source={images.streakFire}
            style={{ width: 22, height: 22 }}
            contentFit="contain"
          />
          <Text
            className="text-h4 ml-1 text-text-primary"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {streak}
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#0D132B" />
      </View>
    </View>
  );
}

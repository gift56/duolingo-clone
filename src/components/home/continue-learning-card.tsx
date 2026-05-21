import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";

type ContinueLearningCardProps = {
  languageName: string;
  levelSubtitle: string;
  onContinue?: () => void;
};

export function ContinueLearningCard({
  languageName,
  levelSubtitle,
  onContinue,
}: ContinueLearningCardProps) {
  return (
    <Pressable
      onPress={onContinue}
      className="mt-4 overflow-hidden rounded-3xl active:opacity-95"
      accessibilityRole="button"
      accessibilityLabel={`Continue learning ${languageName}`}
    >
      <View
        className="relative min-h-[148px] flex-row items-center px-5 py-5"
        style={{
          experimental_backgroundImage:
            "linear-gradient(135deg, #6C4EF5 0%, #5B3BF6 45%, #4D8BFF 100%)",
        }}
      >
        <View
          className="absolute right-0 top-0 h-full w-1/2 opacity-20"
          style={{
            experimental_backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
        />
        <View className="z-10 flex-1 pr-2">
          <Text className="text-body-small text-white/90">Continue learning</Text>
          <Text
            className="mt-0.5 text-white"
            style={{ fontFamily: "Poppins-Bold", fontSize: 28, lineHeight: 34 }}
          >
            {languageName}
          </Text>
          <Text className="text-body-medium mt-0.5 text-white/90">
            {levelSubtitle}
          </Text>
          <View className="mt-4 self-start rounded-2xl bg-white px-6 py-2.5">
            <Text
              className="text-body-medium"
              style={{ fontFamily: "Poppins-SemiBold", color: "#6C4EF5" }}
            >
              Continue
            </Text>
          </View>
        </View>
        <Image
          source={images.palace}
          style={{ width: 110, height: 110 }}
          contentFit="contain"
        />
      </View>
    </Pressable>
  );
}

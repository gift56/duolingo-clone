import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

function SpeechBubble({
  label,
  className,
  textClassName,
}: {
  label: string;
  className: string;
  textClassName: string;
}) {
  return (
    <View className={`absolute rounded-2xl px-4 py-2.5 shadow-sm ${className}`}>
      <Text className={textClassName}>{label}</Text>
    </View>
  );
}

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="screen px-6 pb-6">
        <View className="items-center pt-4">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.mascotLogo}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
            <Text className="text-h3 text-text-primary">lingua</Text>
          </View>
        </View>

        <View className="mt-8 items-center px-2">
          <Text className="text-center text-h1 text-text-primary">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher.</Text>
          </Text>
          <Text className="text-body-medium mt-4 max-w-75 text-center text-text-secondary">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="relative mx-auto mt-6 min-h-85 w-full max-w-85 flex-1 items-center justify-center">
          <SpeechBubble
            label="Hello!"
            className="left-0 top-8 bg-[#E8F2FF]"
            textClassName="text-body-medium text-text-primary"
          />
          <SpeechBubble
            label="¡Hola!"
            className="right-0 top-2 bg-[#EDE9FE]"
            textClassName="text-body-medium text-lingua-purple"
          />
          <SpeechBubble
            label="你好!"
            className="right-2 top-22 bg-[#FFEDE4]"
            textClassName="text-body-medium text-[#E53935]"
          />
          <Image
            source={images.mascotWelcome}
            style={{ width: 320, height: 340 }}
            contentFit="contain"
          />
        </View>

        <Link href="/sign-up" asChild>
          <Pressable className="w-full flex-row items-center justify-center rounded-2xl bg-lingua-purple py-4 active:opacity-90">
            <Text className="text-h4 text-white">Get Started</Text>
            <Text className="absolute right-6 text-h4 text-white">›</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

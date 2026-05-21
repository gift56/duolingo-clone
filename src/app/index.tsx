import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="screen items-center justify-center px-6">
      <Text className="text-h1 text-lingua-purple">lingua</Text>
      <Text className="text-body-medium mt-2 text-center text-text-secondary">
        Design system ready — Poppins, colors, and typography utilities loaded.
      </Text>
      <Link href="/onboarding" asChild>
        <Pressable className="mt-8 rounded-2xl bg-lingua-purple px-8 py-3.5 active:opacity-90">
          <Text className="text-h4 text-white">Open onboarding</Text>
        </Pressable>
      </Link>
    </View>
  );
}

import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useLanguageStoreHydration } from "@/hooks/use-language-store-hydration";
import { useLanguageStore } from "@/store/language-store";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasHydrated = useLanguageStoreHydration();
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );

  if (!isLoaded || !hasHydrated) {
    return (
      <View className="screen flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/language" />;
  }

  return <Redirect href="/(tabs)" />;
}

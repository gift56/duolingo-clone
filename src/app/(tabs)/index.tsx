import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClerk } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabPlaceholderScreen } from "@/components/tab-placeholder-screen";
import { useLanguageStore } from "@/store/language-store";

const TAB_BAR_HEIGHT = 64;

export default function HomeTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useClerk();
  const tabBarOffset = TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 16;
  const clearSelectedLanguage = useLanguageStore(
    (state) => state.clearSelectedLanguage,
  );

  const handleClearAsyncStorage = async () => {
    await AsyncStorage.clear();
    await useLanguageStore.persist.clearStorage();
    clearSelectedLanguage();
    router.replace("/language");
  };

  return (
    <View className="screen flex-1">
      <TabPlaceholderScreen title="Home" />
      <View
        className="absolute left-0 right-0 px-6"
        style={{ bottom: tabBarOffset }}
      >
        <Link href="/language" asChild>
          <Pressable
            className="mb-3 w-full items-center justify-center rounded-2xl border border-border bg-white py-3 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="Change language"
          >
            <Text className="text-body-small text-text-primary">
              Change language
            </Text>
          </Pressable>
        </Link>
        <Pressable
          onPress={() => void signOut()}
          className="mb-3 w-full items-center justify-center rounded-2xl border border-border bg-white py-3 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text className="text-body-small text-text-primary">Log out</Text>
        </Pressable>
        <Pressable
          onPress={() => void handleClearAsyncStorage()}
          className="w-full items-center justify-center rounded-2xl border border-border bg-white py-3 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Clear async storage for testing"
        >
          <Text className="text-body-small text-text-secondary">
            Clear async storage (test)
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

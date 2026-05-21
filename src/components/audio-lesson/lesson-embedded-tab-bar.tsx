import Ionicons from "@expo/vector-icons/Ionicons";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_CONFIG, type TabRouteName } from "@/constants/tab-navigation";
import { colors } from "@/theme/colors";

const TAB_HREFS: Record<TabRouteName, Href> = {
  index: "/(tabs)",
  learn: "/(tabs)/learn",
  "ai-teacher": "/(tabs)/ai-teacher",
  chat: "/(tabs)/chat",
  profile: "/(tabs)/profile",
};

type LessonEmbeddedTabBarProps = {
  activeTab?: TabRouteName;
};

export function LessonEmbeddedTabBar({
  activeTab = "learn",
}: LessonEmbeddedTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View className="h-16 flex-row items-center">
        {TAB_CONFIG.map((tab) => {
          const isFocused = tab.name === activeTab;

          return (
            <Pressable
              key={tab.name}
              onPress={() => router.replace(TAB_HREFS[tab.name])}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={tab.label}
              className="flex-1 items-center justify-center active:opacity-80"
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.iconInactive}
                size={22}
                color={isFocused ? colors.linguaPurple : colors.textSecondary}
              />
              <Text
                className="text-caption mt-0.5"
                style={{
                  fontFamily: isFocused ? "Poppins-SemiBold" : "Poppins-Regular",
                  color: isFocused ? colors.linguaPurple : colors.textSecondary,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

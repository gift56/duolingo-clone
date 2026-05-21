import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_CONFIG } from "@/constants/tab-navigation";
import { colors } from "@/theme/colors";

const TAB_BAR_CONTENT_HEIGHT = 64;
const ACTIVE_CIRCLE_SIZE = 52;
const ICON_SIZE_ACTIVE = 24;
const ICON_SIZE_INACTIVE = 22;

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 280,
  mass: 0.8,
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const tabWidth = screenWidth / TAB_CONFIG.length;
  const circleOffset = useSharedValue(
    state.index * tabWidth + (tabWidth - ACTIVE_CIRCLE_SIZE) / 2,
  );

  useEffect(() => {
    circleOffset.value = withSpring(
      state.index * tabWidth + (tabWidth - ACTIVE_CIRCLE_SIZE) / 2,
      SPRING_CONFIG,
    );
  }, [circleOffset, state.index, tabWidth]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleOffset.value }],
  }));

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View
        style={{
          height: TAB_BAR_CONTENT_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: (TAB_BAR_CONTENT_HEIGHT - ACTIVE_CIRCLE_SIZE) / 2,
              left: 0,
              width: ACTIVE_CIRCLE_SIZE,
              height: ACTIVE_CIRCLE_SIZE,
              borderRadius: ACTIVE_CIRCLE_SIZE / 2,
              backgroundColor: colors.linguaPurple,
            },
            circleStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const tab = TAB_CONFIG[index];
          if (!tab) return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                height: TAB_BAR_CONTENT_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isFocused ? (
                <Ionicons
                  name={tab.iconActive}
                  size={ICON_SIZE_ACTIVE}
                  color={colors.background}
                />
              ) : (
                <View className="items-center">
                  <View
                    style={{
                      height: ACTIVE_CIRCLE_SIZE,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={tab.iconInactive}
                      size={ICON_SIZE_INACTIVE}
                      color={colors.textSecondary}
                    />
                  </View>
                  <Text className="text-caption -mt-1 text-text-secondary">
                    {tab.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

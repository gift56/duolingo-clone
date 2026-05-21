import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type LessonScreenHeaderProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
  onBookmark?: () => void;
};

export function LessonScreenHeader({
  title,
  subtitle,
  onBack,
  onBookmark,
}: LessonScreenHeaderProps) {
  return (
    <View className="flex-row items-start justify-between px-5 pb-3 pt-2">
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="mr-3 mt-0.5 h-10 w-10 items-center justify-center rounded-full active:opacity-70"
      >
        <Ionicons name="chevron-back" size={24} color="#0D132B" />
      </Pressable>

      <View className="flex-1">
        <Text
          className="text-text-primary"
          style={{ fontFamily: "Poppins-Bold", fontSize: 22, lineHeight: 28 }}
        >
          {title}
        </Text>
        <Text className="text-body-small mt-0.5 text-text-secondary">
          {subtitle}
        </Text>
      </View>

      <Pressable
        onPress={onBookmark}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Bookmark unit"
        className="ml-2 h-10 w-10 items-center justify-center active:opacity-70"
      >
        <Ionicons name="bookmark" size={22} color="#FF8A00" />
      </Pressable>
    </View>
  );
}

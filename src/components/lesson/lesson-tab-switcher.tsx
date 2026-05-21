import { Pressable, Text, View } from "react-native";

export type LessonTab = "lessons" | "practice";

type LessonTabSwitcherProps = {
  activeTab: LessonTab;
  onTabChange: (tab: LessonTab) => void;
};

export function LessonTabSwitcher({
  activeTab,
  onTabChange,
}: LessonTabSwitcherProps) {
  return (
    <View className="mx-5 mt-4 rounded-2xl bg-surface p-1">
      <View className="flex-row">
        <TabButton
          label="Lessons"
          isActive={activeTab === "lessons"}
          onPress={() => onTabChange("lessons")}
        />
        <TabButton
          label="Practice"
          isActive={activeTab === "practice"}
          onPress={() => onTabChange("practice")}
        />
      </View>
    </View>
  );
}

function TabButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-xl py-3 ${
        isActive ? "bg-white" : "bg-transparent"
      }`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        className={`text-body-medium ${
          isActive ? "text-lingua-purple" : "text-text-secondary"
        }`}
        style={{
          fontFamily: isActive ? "Poppins-SemiBold" : "Poppins-Regular",
        }}
      >
        {label}
      </Text>
      {isActive ? (
        <View className="mt-2 h-0.5 w-10 rounded-full bg-lingua-purple" />
      ) : null}
    </Pressable>
  );
}

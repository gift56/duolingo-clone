import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import type { TodayPlanItem } from "@/lib/home-data";

type TodaysPlanSectionProps = {
  items: TodayPlanItem[];
  onViewAll?: () => void;
};

function PlanIcon({ item }: { item: TodayPlanItem }) {
  const iconColor = "#FFFFFF";
  const backgroundColor = item.iconTone === "coral" ? "#FF8B7A" : "#6C4EF5";

  const iconName =
    item.iconName === "book"
      ? "book-outline"
      : item.iconName === "headset"
        ? "headset-outline"
        : "sparkles-outline";

  return (
    <View
      className="mr-3 h-11 w-11 items-center justify-center rounded-xl"
      style={{ backgroundColor }}
    >
      <Ionicons name={iconName} size={22} color={iconColor} />
    </View>
  );
}

function PlanStatus({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <View className="h-7 w-7 items-center justify-center rounded-full bg-lingua-purple">
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View
      className="h-7 w-7 rounded-full border-2"
      style={{ borderColor: "#D1D5DB" }}
    />
  );
}

export function TodaysPlanSection({ items, onViewAll }: TodaysPlanSectionProps) {
  return (
    <View className="mt-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="text-text-primary"
          style={{ fontFamily: "Poppins-Bold", fontSize: 18 }}
        >
          Today&apos;s plan
        </Text>
        <Pressable
          onPress={onViewAll}
          accessibilityRole="button"
          accessibilityLabel="View all plan items"
        >
          <Text
            className="text-body-medium"
            style={{ fontFamily: "Poppins-SemiBold", color: "#6C4EF5" }}
          >
            View all
          </Text>
        </Pressable>
      </View>

      <View className="gap-1">
        {items.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center rounded-2xl py-3"
          >
            <PlanIcon item={item} />
            <View className="flex-1">
              <Text
                className="text-text-primary"
                style={{ fontFamily: "Poppins-SemiBold", fontSize: 15 }}
              >
                {item.title}
              </Text>
              <Text className="text-body-small mt-0.5 text-text-secondary">
                {item.subtitle}
              </Text>
            </View>
            <PlanStatus completed={item.completed} />
          </View>
        ))}
      </View>
    </View>
  );
}

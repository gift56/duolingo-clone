import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";

type DailyGoalCardProps = {
  dailyXp: number;
  dailyGoal: number;
};

export function DailyGoalCard({ dailyXp, dailyGoal }: DailyGoalCardProps) {
  const progress = dailyGoal > 0 ? Math.min(dailyXp / dailyGoal, 1) : 0;

  return (
    <View
      className="mt-5 flex-row items-center overflow-hidden rounded-3xl px-5 py-4"
      style={{ backgroundColor: "#FFF6E8" }}
    >
      <View className="flex-1 pr-3">
        <Text className="text-body-medium text-text-primary">Daily goal</Text>
        <Text
          className="mt-1 text-text-primary"
          style={{ fontFamily: "Poppins-Bold", fontSize: 22, lineHeight: 28 }}
        >
          {dailyXp} / {dailyGoal} XP
        </Text>
        <View
          className="mt-3 h-2.5 overflow-hidden rounded-full"
          style={{ backgroundColor: "#FFE4C4" }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: "#FF8A00",
            }}
          />
        </View>
      </View>
      <Image
        source={images.treasure}
        style={{ width: 88, height: 88 }}
        contentFit="contain"
      />
    </View>
  );
}

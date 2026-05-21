import { Platform, StyleSheet, Text, View } from "react-native";

import type { LessonFeedbackRating } from "@/lib/audio-lesson-data";

type AudioLessonFeedbackCardProps = {
  ratings: LessonFeedbackRating[];
  focusLabel: string;
};

export function AudioLessonFeedbackCard({
  ratings,
  focusLabel,
}: AudioLessonFeedbackCardProps) {
  return (
    <View className="px-5 pb-3">
      <View style={styles.card} className="flex-row overflow-hidden rounded-2xl bg-white">
        {ratings.map((rating, index) => (
          <View key={rating.label} className="flex-1 flex-row">
            {index > 0 ? <View className="w-px self-stretch bg-border" /> : null}
            <View className="flex-1 items-center px-2 py-4">
              <Text className="text-caption text-text-secondary">{rating.label}</Text>
              <Text
                className="mt-1"
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 15,
                  color: rating.color,
                }}
              >
                {rating.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text className="text-caption mt-2 text-center text-text-secondary" numberOfLines={1}>
        Focus: {focusLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
});

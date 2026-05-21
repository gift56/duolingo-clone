import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { Lesson, LessonCardStatus } from "@/types/learning";

type LessonCardProps = {
  lesson: Lesson;
  lessonNumber: number;
  status: LessonCardStatus;
  totalLessons: number;
  onPress: () => void;
};

export function LessonCard({
  lesson,
  lessonNumber,
  status,
  totalLessons,
  onPress,
}: LessonCardProps) {
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";

  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 active:opacity-90 ${
        isInProgress
          ? "border-lingua-purple bg-[#F3F0FF]"
          : "border-border bg-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}, lesson ${lessonNumber}`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`text-caption ${
            isInProgress ? "text-lingua-purple" : "text-text-secondary"
          }`}
          style={{
            fontFamily: isInProgress ? "Poppins-SemiBold" : "Poppins-Regular",
          }}
        >
          Lesson {lessonNumber}
        </Text>
        <Text
          className="mt-0.5 text-text-primary"
          style={{ fontFamily: "Poppins-SemiBold", fontSize: 17, lineHeight: 22 }}
        >
          {lesson.title}
        </Text>
        {isInProgress ? (
          <Text
            className="text-caption mt-1 text-lingua-purple"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            In progress
          </Text>
        ) : null}
        {!isCompleted && !isInProgress ? (
          <Text className="text-caption mt-1 text-text-secondary">
            0 / {totalLessons} lessons
          </Text>
        ) : null}
      </View>

      <LessonCardTrailing
        status={status}
        imageUrl={lesson.imageUrl}
      />
    </Pressable>
  );
}

function LessonCardTrailing({
  status,
  imageUrl,
}: {
  status: LessonCardStatus;
  imageUrl: string;
}) {
  if (status === "completed") {
    return (
      <View className="h-11 w-11 items-center justify-center rounded-full bg-success/15">
        <Ionicons name="checkmark-circle" size={32} color="#21C16B" />
      </View>
    );
  }

  if (status === "in_progress") {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 56, height: 56, borderRadius: 12 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View className="h-11 w-11 items-center justify-center">
      <Ionicons name="lock-closed-outline" size={26} color="#9CA3AF" />
    </View>
  );
}

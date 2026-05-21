import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard } from "@/components/lesson/lesson-card";
import { LessonHeroBanner } from "@/components/lesson/lesson-hero-banner";
import { LessonScreenHeader } from "@/components/lesson/lesson-screen-header";
import {
  LessonTabSwitcher,
  type LessonTab,
} from "@/components/lesson/lesson-tab-switcher";
import { buildUnitLessonsScreenData } from "@/lib/lesson-screen-data";
import { useProgressStore } from "@/store/progress-store";

export default function UnitLessonsScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const [activeTab, setActiveTab] = useState<LessonTab>("lessons");

  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );

  const screenData = useMemo(() => {
    if (!unitId) return null;
    return buildUnitLessonsScreenData(unitId, completedLessonIds);
  }, [unitId, completedLessonIds]);

  if (!screenData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body-medium text-text-secondary">
            Unit not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { unit, lessons, unitSubtitle, totalCount } = screenData;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <LessonScreenHeader
        title={unit.title}
        subtitle={unitSubtitle}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <LessonHeroBanner imageUrl={unit.imageUrl} />

        <LessonTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <View className="mt-4 px-5">
          {activeTab === "lessons" ? (
            lessons.map(({ lesson, lessonNumber, status }) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                lessonNumber={lessonNumber}
                status={status}
                totalLessons={totalCount}
                onPress={() =>
                  router.push({
                    pathname: "/lesson/[unitId]/[lessonId]",
                    params: { unitId: unit.id, lessonId: lesson.id },
                  })
                }
              />
            ))
          ) : (
            <View className="mt-6 items-center rounded-2xl border border-border bg-surface px-6 py-10">
              <Text
                className="text-text-primary"
                style={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}
              >
                Practice coming soon
              </Text>
              <Text className="text-body-medium mt-2 text-center text-text-secondary">
                Review vocabulary and phrases from {unit.title} in a future
                update.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

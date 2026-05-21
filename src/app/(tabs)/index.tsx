import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ContinueLearningCard } from "@/components/home/continue-learning-card";
import { DailyGoalCard } from "@/components/home/daily-goal-card";
import { HomeHeader } from "@/components/home/home-header";
import { NextUpCard } from "@/components/home/next-up-card";
import { TodaysPlanSection } from "@/components/home/todays-plan-section";
import { getLanguageById } from "@/data/languages";
import { buildHomeScreenData, getContinueSubtitle } from "@/lib/home-data";
import { useLanguageStore } from "@/store/language-store";
import { useProgressStore } from "@/store/progress-store";

const TAB_BAR_HEIGHT = 64;

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const tabBarOffset = TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 16;

  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const streak = useProgressStore((state) => state.streak);
  const dailyGoal = useProgressStore((state) => state.getDailyGoal());

  const homeData = useMemo(() => {
    if (!selectedLanguageId) return null;
    return buildHomeScreenData(
      selectedLanguageId,
      completedLessonIds,
      dailyXp,
      dailyGoal,
      streak,
    );
  }, [
    selectedLanguageId,
    completedLessonIds,
    dailyXp,
    dailyGoal,
    streak,
  ]);

  const fallbackLanguage = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  if (!homeData || !fallbackLanguage) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="screen flex-1 items-center justify-center px-6">
          <Text className="text-body-medium text-center text-text-secondary">
            Select a language to see your home screen.
          </Text>
          <Link href="/language" asChild>
            <Pressable className="mt-4 rounded-2xl bg-lingua-purple px-6 py-3">
              <Text className="text-body-medium text-white">Choose language</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  const continueSubtitle = getContinueSubtitle(homeData.currentLesson);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: tabBarOffset + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          language={homeData.language}
          greeting={homeData.greeting}
          streak={homeData.streak}
        />

        <DailyGoalCard dailyXp={homeData.dailyXp} dailyGoal={homeData.dailyGoal} />

        <ContinueLearningCard
          languageName={homeData.language.name}
          levelSubtitle={continueSubtitle}
        />

        <TodaysPlanSection items={homeData.todayPlan} />

        <NextUpCard />
      </ScrollView>
    </SafeAreaView>
  );
}

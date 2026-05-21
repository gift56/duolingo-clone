import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "lingua-progress-store";
const DAILY_GOAL_XP = 20;

interface ProgressState {
  completedLessonIds: string[];
  streak: number;
  dailyXp: number;
  lastActiveDate: string | null;
  completeLesson: (lessonId: string, xpReward: number) => void;
  getDailyGoal: () => number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessonIds: [],
      streak: 0,
      dailyXp: 0,
      lastActiveDate: null,
      getDailyGoal: () => DAILY_GOAL_XP,
      completeLesson: (lessonId, xpReward) => {
        const { completedLessonIds, dailyXp, lastActiveDate, streak } = get();
        if (completedLessonIds.includes(lessonId)) return;

        const today = todayKey();
        const isNewDay = lastActiveDate !== today;
        const nextStreak =
          lastActiveDate === null
            ? 1
            : isNewDay
              ? lastActiveDate ===
                  new Date(Date.now() - 86400000).toISOString().slice(0, 10)
                ? streak + 1
                : 1
              : streak;

        set({
          completedLessonIds: [...completedLessonIds, lessonId],
          dailyXp: isNewDay ? xpReward : Math.min(dailyXp + xpReward, DAILY_GOAL_XP),
          streak: nextStreak,
          lastActiveDate: today,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedLessonIds: state.completedLessonIds,
        streak: state.streak,
        dailyXp: state.dailyXp,
        lastActiveDate: state.lastActiveDate,
      }),
    },
  ),
);

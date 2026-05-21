import { getLanguageById } from "@/data/languages";
import { getLessonsForLanguage } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import type { Language, LanguageId, Lesson } from "@/types/learning";

const GREETINGS: Record<LanguageId, string> = {
  spanish: "Hola",
  french: "Bonjour",
  japanese: "こんにちは",
  korean: "안녕하세요",
  german: "Hallo",
  chinese: "你好",
};

const LEVEL_LABEL = "A1";

export type PlanItemType = "lesson" | "conversation" | "vocabulary";

export interface TodayPlanItem {
  id: string;
  type: PlanItemType;
  title: string;
  subtitle: string;
  completed: boolean;
  iconName: "book" | "headset" | "sparkles";
  iconTone: "purple" | "coral";
}

export interface HomeScreenData {
  language: Language;
  greeting: string;
  currentLesson: Lesson;
  levelLabel: string;
  dailyGoal: number;
  dailyXp: number;
  streak: number;
  todayPlan: TodayPlanItem[];
  conversationSubtitle: string;
  vocabularyCount: number;
}

export function getGreetingForLanguage(languageId: LanguageId): string {
  return GREETINGS[languageId] ?? "Hello";
}

export function getCurrentLesson(
  languageId: LanguageId,
  completedLessonIds: string[],
): Lesson {
  const lessons = getLessonsForLanguage(languageId);
  const next = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  return next ?? lessons[lessons.length - 1];
}

export function getLatestCompletedLesson(
  languageId: LanguageId,
  completedLessonIds: string[],
): Lesson | undefined {
  const lessons = getLessonsForLanguage(languageId);
  const completed = lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  );
  return completed[completed.length - 1];
}

export function buildTodayPlan(
  languageId: LanguageId,
  completedLessonIds: string[],
): TodayPlanItem[] {
  const currentLesson = getCurrentLesson(languageId, completedLessonIds);
  const latestCompleted = getLatestCompletedLesson(
    languageId,
    completedLessonIds,
  );
  const lessonPlan = latestCompleted ?? currentLesson;
  const lessonDone = latestCompleted !== undefined;

  return [
    {
      id: "plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: lessonPlan.title,
      completed: lessonDone,
      iconName: "book",
      iconTone: "purple",
    },
    {
      id: "plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: truncateSubtitle(currentLesson.description, 32),
      completed: false,
      iconName: "headset",
      iconTone: "purple",
    },
    {
      id: "plan-vocabulary",
      type: "vocabulary",
      title: "New words",
      subtitle: `${currentLesson.vocabulary.length} words`,
      completed: false,
      iconName: "sparkles",
      iconTone: "coral",
    },
  ];
}

function truncateSubtitle(text: string, maxLength: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}…`;
}

export function buildHomeScreenData(
  languageId: LanguageId,
  completedLessonIds: string[],
  dailyXp: number,
  dailyGoal: number,
  streak: number,
): HomeScreenData | null {
  const language = getLanguageById(languageId);
  if (!language) return null;

  const currentLesson = getCurrentLesson(languageId, completedLessonIds);
  const unit = getUnitById(currentLesson.unitId);
  return {
    language,
    greeting: getGreetingForLanguage(languageId),
    currentLesson,
    levelLabel: `${LEVEL_LABEL} • Unit ${unit?.order ?? 1}`,
    dailyGoal,
    dailyXp,
    streak,
    todayPlan: buildTodayPlan(languageId, completedLessonIds),
    conversationSubtitle: truncateSubtitle(
      currentLesson.aiTeacher.openingLine,
      32,
    ),
    vocabularyCount: currentLesson.vocabulary.length,
  };
}

/** Resolve lesson metadata for continue card subtitle */
export function getContinueSubtitle(lesson: Lesson): string {
  const unit = getUnitById(lesson.unitId);
  const level = lesson.aiTeacher.level === "beginner" ? "A1" : "A2";
  return `${level} • Unit ${unit?.order ?? 1}`;
}

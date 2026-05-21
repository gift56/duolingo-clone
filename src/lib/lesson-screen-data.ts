import { getLessonsForUnit } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import type { Lesson, LessonCardStatus, Unit } from "@/types/learning";

export interface LessonWithStatus {
  lesson: Lesson;
  status: LessonCardStatus;
  lessonNumber: number;
}

export interface UnitLessonsScreenData {
  unit: Unit;
  lessons: LessonWithStatus[];
  completedCount: number;
  totalCount: number;
  currentLessonId: string | null;
  unitSubtitle: string;
}

export function getCurrentLessonIdForUnit(
  unitLessons: Lesson[],
  completedLessonIds: string[],
): string | null {
  const next = unitLessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );
  return next?.id ?? null;
}

export function getLessonCardStatus(
  lessonId: string,
  completedLessonIds: string[],
  currentLessonId: string | null,
): LessonCardStatus {
  if (completedLessonIds.includes(lessonId)) return "completed";
  if (lessonId === currentLessonId) return "in_progress";
  return "not_started";
}

export function buildUnitLessonsScreenData(
  unitId: string,
  completedLessonIds: string[],
): UnitLessonsScreenData | null {
  const unit = getUnitById(unitId);
  if (!unit) return null;

  const unitLessons = getLessonsForUnit(unitId);
  const currentLessonId = getCurrentLessonIdForUnit(
    unitLessons,
    completedLessonIds,
  );
  const completedCount = unitLessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;

  const lessons: LessonWithStatus[] = unitLessons.map((lesson, index) => ({
    lesson,
    lessonNumber: index + 1,
    status: getLessonCardStatus(
      lesson.id,
      completedLessonIds,
      currentLessonId,
    ),
  }));

  return {
    unit,
    lessons,
    completedCount,
    totalCount: unitLessons.length,
    currentLessonId,
    unitSubtitle: `Unit ${unit.order} • ${completedCount} / ${unitLessons.length} lessons`,
  };
}

const LANGUAGE_UNIT_PREFIX: Record<string, string> = {
  spanish: "es",
  french: "fr",
  japanese: "ja",
  korean: "ko",
  german: "de",
  chinese: "zh",
};

/** Prefer the café unit (unit 3) when available for the learn flow. */
export function getFeaturedUnitId(languageId: string): string | undefined {
  const prefix = LANGUAGE_UNIT_PREFIX[languageId];
  if (!prefix) return undefined;
  const unitId = `${prefix}-unit-3`;
  return getUnitById(unitId) ? unitId : undefined;
}

import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import type { Language, Lesson, Phrase } from "@/types/learning";

export type LessonFeedbackRating = {
  label: string;
  value: string;
  color: string;
};

export interface AudioLessonScreenData {
  lesson: Lesson;
  language: Language;
  sessionSubtitle: string;
  teacherBubble: {
    primary: string;
    secondary: string;
  };
  phraseQueue: Phrase[];
  focusLabel: string;
  feedback: LessonFeedbackRating[];
}

const FEEDBACK_BY_LEVEL: Record<
  Lesson["aiTeacher"]["level"],
  LessonFeedbackRating[]
> = {
  beginner: [
    { label: "Speaking", value: "Excellent", color: "#21C16B" },
    { label: "Pronunciation", value: "Great", color: "#4D8BFF" },
    { label: "Grammar", value: "Good", color: "#6C4EF5" },
  ],
  intermediate: [
    { label: "Speaking", value: "Great", color: "#21C16B" },
    { label: "Pronunciation", value: "Good", color: "#4D8BFF" },
    { label: "Grammar", value: "Fair", color: "#6C4EF5" },
  ],
};

function pickTeacherBubble(lesson: Lesson): {
  primary: string;
  secondary: string;
} {
  const praisePhrase = lesson.phrases.find((phrase) =>
    /muy bien|great|bravo|よく|잘|gut|好/i.test(phrase.text + phrase.translation),
  );
  const phrase = praisePhrase ?? lesson.phrases[0];

  if (phrase) {
    return {
      primary: phrase.text,
      secondary: phrase.translation,
    };
  }

  return {
    primary: lesson.aiTeacher.openingLine,
    secondary: lesson.goals[0]?.description ?? lesson.description,
  };
}

export function buildAudioLessonScreenData(
  lessonId: string,
): AudioLessonScreenData | null {
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;

  const language = getLanguageById(lesson.languageId);
  if (!language) return null;

  const goalSummary =
    lesson.goals.length > 0
      ? lesson.goals.map((goal) => goal.description).join(" • ")
      : lesson.description;

  const focusTopics = lesson.aiTeacher.focusTopics.slice(0, 3).join(", ");

  return {
    lesson,
    language,
    sessionSubtitle: `${language.name} · ${lesson.title}`,
    teacherBubble: pickTeacherBubble(lesson),
    phraseQueue: lesson.phrases,
    focusLabel: focusTopics || goalSummary,
    feedback: FEEDBACK_BY_LEVEL[lesson.aiTeacher.level],
  };
}

export function getPhraseAtIndex(
  phrases: Phrase[],
  index: number,
): { primary: string; secondary: string } {
  if (phrases.length === 0) {
    return { primary: "", secondary: "" };
  }
  const phrase = phrases[index % phrases.length];
  return {
    primary: phrase.text,
    secondary: phrase.translation,
  };
}

import type { LanguageId, Lesson } from "@/types/learning";

const lessonImage = (lessonId: string) =>
  `https://picsum.photos/seed/${lessonId}/400/300`;

const CAFE_LESSON_TITLES = [
  "Greetings & Introductions",
  "Daily Life",
  "At the Café",
  "Travel & Directions",
  "Shopping",
  "Family & Friends",
] as const;

const LANGUAGE_PREFIX: Record<LanguageId, string> = {
  spanish: "es",
  french: "fr",
  japanese: "ja",
  korean: "ko",
  german: "de",
  chinese: "zh",
};

const UNIT_ID: Record<LanguageId, string> = {
  spanish: "es-unit-3",
  french: "fr-unit-3",
  japanese: "ja-unit-3",
  korean: "ko-unit-3",
  german: "de-unit-3",
  chinese: "zh-unit-3",
};

const OPENING_LINES: Record<LanguageId, string> = {
  spanish: "¡Bienvenido al café! Practiquemos juntos.",
  french: "Bienvenue au café ! Pratiquons ensemble.",
  japanese: "カフェへようこそ！一緒に練習しましょう。",
  korean: "카페에 오신 것을 환영해요! 함께 연습해요.",
  german: "Willkommen im Café! Üben wir zusammen.",
  chinese: "欢迎来到咖啡馆！一起练习吧。",
};

function buildCafeLesson(
  languageId: LanguageId,
  order: number,
  title: (typeof CAFE_LESSON_TITLES)[number],
): Lesson {
  const prefix = LANGUAGE_PREFIX[languageId];
  const id = `${prefix}-3-${order}`;
  return {
    id,
    unitId: UNIT_ID[languageId],
    languageId,
    title,
    subtitle: `Lesson ${order}`,
    description: `Practice ${title.toLowerCase()} in real café scenarios.`,
    order,
    xpReward: order === 3 ? 20 : 15,
    estimatedMinutes: 6 + (order % 2),
    imageUrl: lessonImage(id),
    goals: [{ id: "g1", description: `Complete the ${title} lesson` }],
    vocabulary: [
      { id: "v1", word: "café", translation: "café / coffee shop" },
      { id: "v2", word: "mesa", translation: "table" },
      { id: "v3", word: "por favor", translation: "please" },
    ],
    phrases: [
      {
        id: "p1",
        text: "Un café, por favor.",
        translation: "A coffee, please.",
        context: "Ordering at the counter",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "listen",
        order: 1,
        prompt: "Listen and tap the meaning",
        audioText: "Un café, por favor.",
        translation: "A coffee, please.",
      },
      {
        id: "a2",
        type: "multiple_choice",
        order: 2,
        prompt: "Choose the best response",
        question: "How do you say please?",
        options: ["por favor", "adiós", "casa", "uno"],
        correctIndex: 0,
      },
    ],
    aiTeacher: {
      systemContext: `Teach ${title} for ${languageId} learners in a café setting. Keep it beginner-friendly.`,
      openingLine: OPENING_LINES[languageId],
      focusTopics: [title],
      level: "beginner",
    },
  };
}

const CAFE_LANGUAGES: LanguageId[] = [
  "spanish",
  "french",
  "japanese",
  "korean",
  "german",
  "chinese",
];

export const cafeUnitLessons: Lesson[] = CAFE_LANGUAGES.flatMap((languageId) =>
  CAFE_LESSON_TITLES.map((title, index) =>
    buildCafeLesson(languageId, index + 1, title),
  ),
);

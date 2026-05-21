import type { LanguageId, Lesson } from "@/types/learning";

const lessonImage = (lessonId: string) =>
  `https://picsum.photos/seed/${lessonId}/400/300`;

type ExtraLanguageConfig = {
  languageId: LanguageId;
  prefix: string;
  unit1: string;
  unit2: string;
  helloWord: string;
  goodbyeWord: string;
  openingLine: string;
};

const EXTRA_LANGUAGES: ExtraLanguageConfig[] = [
  {
    languageId: "korean",
    prefix: "ko",
    unit1: "ko-unit-1",
    unit2: "ko-unit-2",
    helloWord: "안녕하세요",
    goodbyeWord: "안녕히 가세요",
    openingLine: "안녕하세요! 오늘은 인사를 배워요.",
  },
  {
    languageId: "german",
    prefix: "de",
    unit1: "de-unit-1",
    unit2: "de-unit-2",
    helloWord: "Hallo",
    goodbyeWord: "Auf Wiedersehen",
    openingLine: "Hallo! Heute lernen wir Begrüßungen.",
  },
  {
    languageId: "chinese",
    prefix: "zh",
    unit1: "zh-unit-1",
    unit2: "zh-unit-2",
    helloWord: "你好",
    goodbyeWord: "再见",
    openingLine: "你好！今天我们来学习问候语。",
  },
];

const BASICS_LESSONS = [
  { title: "Hello & Goodbye", order: 1, unitKey: "unit1" as const },
  { title: "Numbers 1–5", order: 2, unitKey: "unit1" as const },
  { title: "Everyday Nouns", order: 3, unitKey: "unit1" as const },
  { title: "Introducing Yourself", order: 1, unitKey: "unit2" as const },
  { title: "Please & Thank You", order: 2, unitKey: "unit2" as const },
  { title: "How Are You?", order: 3, unitKey: "unit2" as const },
];

function buildBasicsLesson(
  config: ExtraLanguageConfig,
  lessonIndex: number,
  spec: (typeof BASICS_LESSONS)[number],
): Lesson {
  const unitId = spec.unitKey === "unit1" ? config.unit1 : config.unit2;
  const unitOrder = spec.unitKey === "unit1" ? 1 : 2;
  const id = `${config.prefix}-${unitOrder}-${spec.order}`;
  return {
    id,
    unitId,
    languageId: config.languageId,
    title: spec.title,
    subtitle: `Lesson ${spec.order + (unitOrder === 2 ? 3 : 0)}`,
    description: `Learn ${spec.title.toLowerCase()} in ${config.languageId}.`,
    order: spec.order,
    xpReward: 10 + spec.order * 2,
    estimatedMinutes: 5 + spec.order,
    imageUrl: lessonImage(id),
    goals: [{ id: "g1", description: `Complete ${spec.title}` }],
    vocabulary: [
      { id: "v1", word: config.helloWord, translation: "hello" },
      { id: "v2", word: config.goodbyeWord, translation: "goodbye" },
    ],
    phrases: [
      {
        id: "p1",
        text: config.helloWord,
        translation: "Hello",
        context: "Greeting someone",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "listen",
        order: 1,
        prompt: "Listen and choose the meaning",
        audioText: config.helloWord,
        translation: "Hello",
      },
      {
        id: "a2",
        type: "speak",
        order: 2,
        prompt: "Repeat the greeting",
        targetPhrase: config.helloWord,
      },
    ],
    aiTeacher: {
      systemContext: `Friendly ${config.languageId} tutor for absolute beginners.`,
      openingLine: config.openingLine,
      focusTopics: [config.helloWord, config.goodbyeWord],
      level: "beginner",
    },
  };
}

export const extraLanguageLessons: Lesson[] = EXTRA_LANGUAGES.flatMap((config) =>
  BASICS_LESSONS.map((spec, index) =>
    buildBasicsLesson(config, index, spec),
  ),
);

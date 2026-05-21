import { images } from "@/constants/images";
import type { LanguageId, Unit } from "@/types/learning";

export const units: Unit[] = [
  // Spanish
  {
    id: "es-unit-1",
    languageId: "spanish",
    title: "Basics 1",
    description: "Essential words and simple phrases to get started.",
    order: 1,
  },
  {
    id: "es-unit-2",
    languageId: "spanish",
    title: "Greetings",
    description: "Say hello, introduce yourself, and be polite.",
    order: 2,
  },
  {
    id: "es-unit-3",
    languageId: "spanish",
    title: "At the Café",
    description: "Order drinks, chat with staff, and enjoy café culture.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
  // French
  {
    id: "fr-unit-1",
    languageId: "french",
    title: "Basics 1",
    description: "Core vocabulary and your first French sentences.",
    order: 1,
  },
  {
    id: "fr-unit-2",
    languageId: "french",
    title: "Greetings",
    description: "Meet people and use everyday courtesy in French.",
    order: 2,
  },
  {
    id: "fr-unit-3",
    languageId: "french",
    title: "At the Café",
    description: "Order at a Parisian café and make small talk.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
  // Japanese
  {
    id: "ja-unit-1",
    languageId: "japanese",
    title: "Basics 1",
    description: "Polite words and simple phrases for daily life.",
    order: 1,
  },
  {
    id: "ja-unit-2",
    languageId: "japanese",
    title: "Greetings",
    description: "Greet others and introduce yourself in Japanese.",
    order: 2,
  },
  {
    id: "ja-unit-3",
    languageId: "japanese",
    title: "At the Café",
    description: "Order politely at a kissaten and café in Japan.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
  // Korean
  {
    id: "ko-unit-1",
    languageId: "korean",
    title: "Basics 1",
    description: "Essential Korean words and simple phrases.",
    order: 1,
  },
  {
    id: "ko-unit-2",
    languageId: "korean",
    title: "Greetings",
    description: "Say hello and introduce yourself in Korean.",
    order: 2,
  },
  {
    id: "ko-unit-3",
    languageId: "korean",
    title: "At the Café",
    description: "Order drinks and snacks at a Korean café.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
  // German
  {
    id: "de-unit-1",
    languageId: "german",
    title: "Basics 1",
    description: "Core German vocabulary for everyday life.",
    order: 1,
  },
  {
    id: "de-unit-2",
    languageId: "german",
    title: "Greetings",
    description: "Greet people and use polite German phrases.",
    order: 2,
  },
  {
    id: "de-unit-3",
    languageId: "german",
    title: "At the Café",
    description: "Order coffee and cake at a German café.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
  // Chinese
  {
    id: "zh-unit-1",
    languageId: "chinese",
    title: "Basics 1",
    description: "Start with tones and essential Mandarin words.",
    order: 1,
  },
  {
    id: "zh-unit-2",
    languageId: "chinese",
    title: "Greetings",
    description: "Greet others and introduce yourself in Mandarin.",
    order: 2,
  },
  {
    id: "zh-unit-3",
    languageId: "chinese",
    title: "At the Café",
    description: "Order tea and snacks at a Chinese teahouse.",
    order: 3,
    imageUrl: images.unitCafeHero,
  },
];

export function getUnitsForLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

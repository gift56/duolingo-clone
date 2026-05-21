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
];

export function getUnitsForLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

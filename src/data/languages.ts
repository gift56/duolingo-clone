import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w80/es.png",
    description: "Learn everyday Spanish for travel and conversation.",
    locale: "es",
    learnerCount: "28.4M learners",
  },
  {
    id: "french",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w80/fr.png",
    description: "Build confidence with French greetings and basics.",
    locale: "fr",
    learnerCount: "19.4M learners",
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w80/jp.png",
    description: "Start with hiragana-friendly phrases and polite forms.",
    locale: "ja",
    learnerCount: "12.7M learners",
  },
  {
    id: "korean",
    name: "Korean",
    nativeName: "한국어",
    flag: "https://flagcdn.com/w80/kr.png",
    description: "Learn Hangul basics and everyday Korean phrases.",
    locale: "ko",
    learnerCount: "9.3M learners",
  },
  {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    flag: "https://flagcdn.com/w80/de.png",
    description: "Master German greetings and essential travel phrases.",
    locale: "de",
    learnerCount: "8.1M learners",
  },
  {
    id: "chinese",
    name: "Chinese",
    nativeName: "中文",
    flag: "https://flagcdn.com/w80/cn.png",
    description: "Start with Mandarin tones and common daily expressions.",
    locale: "zh",
    learnerCount: "7.4M learners",
  },
];

export function getLanguageById(id: string): Language | undefined {
  return languages.find((lang) => lang.id === id);
}

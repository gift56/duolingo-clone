/**
 * Learning content types for hardcoded lesson data.
 * Used by language selection, lesson path, and audio lesson screens.
 */

/** Supported study languages */
export type LanguageId =
  | "spanish"
  | "french"
  | "japanese"
  | "korean"
  | "german"
  | "chinese";

export interface Language {
  id: LanguageId;
  /** Display name in English */
  name: string;
  /** Name in the target language */
  nativeName: string;
  flag: string;
  description: string;
  /** BCP-47 locale for TTS and formatting */
  locale: string;
  /** Display string for the language picker, e.g. "28.4M learners" */
  learnerCount: string;
}

export interface Unit {
  id: string;
  languageId: LanguageId;
  title: string;
  description: string;
  order: number;
}

export type ActivityType =
  | "listen"
  | "speak"
  | "translate"
  | "match"
  | "fill_blank"
  | "multiple_choice";

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  /** When or how to use the phrase */
  context?: string;
}

export interface LessonGoal {
  id: string;
  description: string;
}

/** Prompts for future Vision Agent / audio AI teacher sessions */
export interface AITeacherPrompt {
  systemContext: string;
  openingLine: string;
  focusTopics: string[];
  level: "beginner" | "intermediate";
}

interface BaseActivity {
  id: string;
  type: ActivityType;
  prompt: string;
  order: number;
}

export interface ListenActivity extends BaseActivity {
  type: "listen";
  audioText: string;
  translation: string;
}

export interface SpeakActivity extends BaseActivity {
  type: "speak";
  targetPhrase: string;
  hint?: string;
}

export interface TranslateActivity extends BaseActivity {
  type: "translate";
  sourceText: string;
  targetText: string;
}

export interface MatchActivity extends BaseActivity {
  type: "match";
  pairs: { term: string; match: string }[];
}

export interface FillBlankActivity extends BaseActivity {
  type: "fill_blank";
  sentence: string;
  blank: string;
  options: string[];
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: "multiple_choice";
  question: string;
  options: string[];
  correctIndex: number;
}

export type Activity =
  | ListenActivity
  | SpeakActivity
  | TranslateActivity
  | MatchActivity
  | FillBlankActivity
  | MultipleChoiceActivity;

export interface Lesson {
  id: string;
  unitId: string;
  languageId: LanguageId;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacher: AITeacherPrompt;
  /** Lesson card image (remote placeholder until assets are added) */
  imageUrl: string;
}

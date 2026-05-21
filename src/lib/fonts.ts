import { fontFamily } from "@/theme/fonts";

/**
 * Font assets for expo-font (runtime loading fallback).
 * Prefer the expo-font config plugin in app.json for production builds.
 */
export const fontAssets = {
  [fontFamily.regular]: require("@/assets/fonts/Poppins-Regular.ttf"),
  [fontFamily.medium]: require("@/assets/fonts/Poppins-Medium.ttf"),
  [fontFamily.semibold]: require("@/assets/fonts/Poppins-SemiBold.ttf"),
  [fontFamily.bold]: require("@/assets/fonts/Poppins-Bold.ttf"),
} as const;

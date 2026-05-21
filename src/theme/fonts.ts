/**
 * Poppins font family names (must match PostScript names / file names).
 */
export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export type FontFamilyToken = keyof typeof fontFamily;

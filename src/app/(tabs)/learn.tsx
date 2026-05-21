import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLanguageById } from "@/data/languages";
import { getUnitsForLanguage } from "@/data/units";
import { getFeaturedUnitId } from "@/lib/lesson-screen-data";
import { useLanguageStore } from "@/store/language-store";

export default function LearnTab() {
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  const units = useMemo(() => {
    if (!selectedLanguageId) return [];
    return getUnitsForLanguage(selectedLanguageId);
  }, [selectedLanguageId]);

  const featuredUnitId = selectedLanguageId
    ? getFeaturedUnitId(selectedLanguageId)
    : undefined;

  if (!selectedLanguageId || !language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body-medium text-center text-text-secondary">
            Select a language to browse lessons.
          </Text>
          <Pressable
            onPress={() => router.push("/language")}
            className="mt-4 rounded-2xl bg-lingua-purple px-6 py-3"
          >
            <Text className="text-body-medium text-white">Choose language</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-text-primary"
          style={{ fontFamily: "Poppins-Bold", fontSize: 28, lineHeight: 34 }}
        >
          Learn {language.name}
        </Text>
        <Text className="text-body-medium mt-1 text-text-secondary">
          Pick a unit to view lessons
        </Text>

        {featuredUnitId ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/lesson/[unitId]",
                params: { unitId: featuredUnitId },
              })
            }
            className="mt-5 overflow-hidden rounded-3xl active:opacity-95"
            style={{
              experimental_backgroundImage:
                "linear-gradient(135deg, #6C4EF5 0%, #5B3BF6 45%, #4D8BFF 100%)",
            }}
          >
            <View className="px-5 py-5">
              <Text className="text-body-small text-white/90">Continue unit</Text>
              <Text
                className="mt-1 text-white"
                style={{ fontFamily: "Poppins-Bold", fontSize: 22 }}
              >
                At the Café
              </Text>
              <Text className="text-body-small mt-1 text-white/90">
                Unit 3 • 6 lessons
              </Text>
            </View>
          </Pressable>
        ) : null}

        <Text
          className="mt-6 text-text-primary"
          style={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}
        >
          All units
        </Text>

        {units.map((unit) => (
          <Pressable
            key={unit.id}
            onPress={() =>
              router.push({
                pathname: "/lesson/[unitId]",
                params: { unitId: unit.id },
              })
            }
            className="mt-3 rounded-2xl border border-border bg-white px-4 py-4 active:opacity-90"
          >
            <Text className="text-caption text-text-secondary">
              Unit {unit.order}
            </Text>
            <Text
              className="mt-0.5 text-text-primary"
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 17 }}
            >
              {unit.title}
            </Text>
            <Text className="text-body-small mt-1 text-text-secondary">
              {unit.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

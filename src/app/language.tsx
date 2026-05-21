import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStoreHydration } from "@/hooks/use-language-store-hydration";
import { useLanguageStore } from "@/store/language-store";
import type { Language, LanguageId } from "@/types/learning";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EARTH_WIDTH = SCREEN_WIDTH;
const EARTH_HEIGHT = Math.round(SCREEN_WIDTH * 0.36);

function LanguageRow({
  language,
  selected,
  onPress,
}: {
  language: Language;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-2.5 flex-row items-center rounded-2xl border px-4 py-3.5 active:opacity-90 ${
        selected
          ? "border-lingua-purple bg-[#F3F0FF]"
          : "border-border bg-white"
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${language.name}, ${language.learnerCount}`}
    >
      <Image
        source={{ uri: language.flag }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
        contentFit="cover"
      />
      <View className="ml-3 flex-1">
        <Text className="text-h4 text-text-primary">{language.name}</Text>
        <Text className="text-body-small mt-0.5 text-text-secondary">
          {language.learnerCount}
        </Text>
      </View>
      {selected ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-lingua-purple">
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      )}
    </Pressable>
  );
}

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasHydrated = useLanguageStoreHydration();
  const storedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const setSelectedLanguage = useLanguageStore(
    (state) => state.setSelectedLanguage,
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<LanguageId>(
    storedLanguageId ?? "spanish",
  );

  useEffect(() => {
    if (hasHydrated && storedLanguageId) {
      setSelectedId(storedLanguageId);
    }
  }, [hasHydrated, storedLanguageId]);

  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return languages;
    return languages.filter(
      (language) =>
        language.name.toLowerCase().includes(normalized) ||
        language.nativeName.toLowerCase().includes(normalized),
    );
  }, [query]);

  const handleConfirm = () => {
    setSelectedLanguage(selectedId);
    router.replace("/(tabs)/index");
  };

  if (!hasHydrated) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        edges={["top"]}
      >
        <View className="screen flex-1 items-center justify-center">
          <Text className="text-body-medium text-text-secondary">Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      <View className="screen flex-1">
        <View className="flex-row items-center px-4 pb-2 pt-1">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="z-10 h-10 w-10 items-center justify-center active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color="#0D132B" />
          </Pressable>
          <Text className="text-h4 absolute left-0 right-0 text-center text-text-primary">
            Choose a language
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          className="px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12, paddingHorizontal: 20 }}
        >
          <View className="flex-row items-center rounded-2xl border border-border bg-white px-4 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search languages"
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 text-body-medium text-text-primary"
              style={{ padding: 0, margin: 0 }}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <Text className="text-h4 mt-5 text-text-primary">Popular</Text>

          <View className="mt-2.5">
            {filteredLanguages.map((language) => (
              <LanguageRow
                key={language.id}
                language={language}
                selected={selectedId === language.id}
                onPress={() => setSelectedId(language.id)}
              />
            ))}
          </View>

          {filteredLanguages.length === 0 ? (
            <Text className="text-body-medium mt-4 text-center text-text-secondary">
              No languages match your search.
            </Text>
          ) : null}

          <Pressable
            onPress={() => setQuery("")}
            className="relative mt-3 w-full flex-row items-center justify-center rounded-2xl border border-border bg-white py-3.5 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="See all languages"
          >
            <View className="absolute left-5">
              <Ionicons name="globe-outline" size={22} color="#6B7280" />
            </View>
            <Text className="text-h4 text-text-primary">See all languages</Text>
          </Pressable>
        </ScrollView>

        <View style={{ paddingBottom: Math.max(insets.bottom, 0) }}>
          <View className="px-4 pb-2">
            <Pressable
              onPress={handleConfirm}
              className="w-full items-center justify-center rounded-2xl bg-lingua-purple py-3.5 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Confirm language selection"
            >
              <Text className="text-h4 text-white">Continue</Text>
            </Pressable>
          </View>
          <Image
            source={images.earth}
            style={{
              width: EARTH_WIDTH,
              height: EARTH_HEIGHT,
            }}
            contentFit="cover"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

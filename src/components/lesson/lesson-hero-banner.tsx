import { Image } from "expo-image";
import { View } from "react-native";

import { images } from "@/constants/images";

type LessonHeroBannerProps = {
  imageUrl?: string;
};

export function LessonHeroBanner({ imageUrl }: LessonHeroBannerProps) {
  const source = imageUrl ? { uri: imageUrl } : images.palace;

  return (
    <View className="mx-5 overflow-hidden rounded-3xl">
      <Image
        source={source}
        style={{ width: "100%", height: 200 }}
        contentFit="cover"
      />
    </View>
  );
}

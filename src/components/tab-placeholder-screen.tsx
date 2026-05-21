import { Text, View } from "react-native";

type TabPlaceholderScreenProps = {
  title: string;
};

export function TabPlaceholderScreen({ title }: TabPlaceholderScreenProps) {
  return (
    <View className="screen flex-1 items-center justify-center px-6">
      <Text className="text-h2 text-text-primary">{title}</Text>
      <Text className="text-body-medium mt-2 text-center text-text-secondary">
        Coming soon
      </Text>
    </View>
  );
}

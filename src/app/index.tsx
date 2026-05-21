import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View className="screen flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="screen flex-1 items-center justify-center px-6">
        <Text className="text-h1 text-lingua-purple">lingua</Text>
        <Text className="text-body-medium mt-2 text-center text-text-secondary">
          Design system ready — Poppins, colors, and typography utilities loaded.
        </Text>
        {user?.primaryEmailAddress?.emailAddress ? (
          <Text className="text-body-medium mt-4 text-center text-text-secondary">
            Signed in as {user.primaryEmailAddress.emailAddress}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void signOut()}
          className="mt-8 w-full max-w-xs items-center justify-center rounded-2xl border border-border bg-white py-3.5 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text className="text-h4 text-text-primary">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

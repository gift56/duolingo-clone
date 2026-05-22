import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";

import { CustomTabBar } from "@/components/navigation/custom-tab-bar";
import { UNAUTHENTICATED_ENTRY } from "@/lib/auth-navigation";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={UNAUTHENTICATED_ENTRY} />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen
        name="ai-teacher"
        options={{ title: "AI Teacher" }}
      />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

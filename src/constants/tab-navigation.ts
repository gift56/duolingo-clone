import type { Ionicons } from "@expo/vector-icons";

export type TabRouteName =
  | "index"
  | "learn"
  | "ai-teacher"
  | "chat"
  | "profile";

export type TabConfig = {
  name: TabRouteName;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
};

export const TAB_CONFIG: TabConfig[] = [
  {
    name: "index",
    label: "Home",
    iconActive: "home",
    iconInactive: "home-outline",
  },
  {
    name: "learn",
    label: "Learn",
    iconActive: "book",
    iconInactive: "book-outline",
  },
  {
    name: "ai-teacher",
    label: "AI Teacher",
    iconActive: "sparkles",
    iconInactive: "sparkles-outline",
  },
  {
    name: "chat",
    label: "Chat",
    iconActive: "chatbubble",
    iconInactive: "chatbubble-outline",
  },
  {
    name: "profile",
    label: "Profile",
    iconActive: "person",
    iconInactive: "person-outline",
  },
];

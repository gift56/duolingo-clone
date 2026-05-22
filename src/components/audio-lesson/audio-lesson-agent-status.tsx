import { Text, View } from "react-native";

import type { VisionAgentStatus } from "@/types/stream";

type AudioLessonAgentStatusProps = {
  status: VisionAgentStatus;
  errorMessage?: string | null;
};

const STATUS_CONFIG: Record<
  VisionAgentStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  idle: {
    label: "AI teacher idle",
    dotColor: "#9AA3B8",
    textColor: "#5C6478",
  },
  connecting: {
    label: "AI teacher connecting…",
    dotColor: "#6C4EF5",
    textColor: "#6C4EF5",
  },
  connected: {
    label: "AI teacher connected",
    dotColor: "#21C16B",
    textColor: "#21C16B",
  },
  failed: {
    label: "AI teacher failed",
    dotColor: "#E5484D",
    textColor: "#E5484D",
  },
};

export function AudioLessonAgentStatus({
  status,
  errorMessage,
}: AudioLessonAgentStatusProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View className="items-center">
      <View className="flex-row items-center">
        <View
          className="mr-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: config.dotColor }}
        />
        <Text
          className="text-caption"
          style={{ fontFamily: "Poppins-SemiBold", color: config.textColor }}
        >
          {config.label}
        </Text>
      </View>
      {status === "failed" && errorMessage ? (
        <Text
          className="text-caption mt-0.5 max-w-65 text-center text-error"
          numberOfLines={2}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

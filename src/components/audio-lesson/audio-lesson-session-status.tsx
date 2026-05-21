import { Text, View } from "react-native";

import type { StreamCallStatus } from "@/types/stream";

type AudioLessonSessionStatusProps = {
  status: StreamCallStatus;
  errorMessage?: string | null;
  participantCount?: number;
};

const STATUS_CONFIG: Record<
  StreamCallStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  idle: {
    label: "Ready",
    dotColor: "#9AA3B8",
    textColor: "#5C6478",
  },
  loading: {
    label: "Loading…",
    dotColor: "#6C4EF5",
    textColor: "#6C4EF5",
  },
  connecting: {
    label: "Connecting…",
    dotColor: "#6C4EF5",
    textColor: "#6C4EF5",
  },
  joined: {
    label: "In call",
    dotColor: "#21C16B",
    textColor: "#21C16B",
  },
  muted: {
    label: "Muted",
    dotColor: "#F5A623",
    textColor: "#C47D00",
  },
  error: {
    label: "Connection failed",
    dotColor: "#E5484D",
    textColor: "#E5484D",
  },
  ended: {
    label: "Call ended",
    dotColor: "#9AA3B8",
    textColor: "#5C6478",
  },
};

export function AudioLessonSessionStatus({
  status,
  errorMessage,
  participantCount = 0,
}: AudioLessonSessionStatusProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View className="items-center">
      <View className="flex-row items-center">
        <View
          className="mr-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: config.dotColor }}
        />
        <Text
          className="text-body-small"
          style={{ fontFamily: "Poppins-SemiBold", color: config.textColor }}
        >
          {config.label}
        </Text>
        {status === "joined" || status === "muted" ? (
          <Text className="text-caption ml-2 text-text-secondary">
            {participantCount} in call
          </Text>
        ) : null}
      </View>
      {status === "error" && errorMessage ? (
        <Text
          className="text-caption mt-1 max-w-[260px] text-center text-error"
          numberOfLines={2}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

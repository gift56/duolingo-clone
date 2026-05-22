import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type AudioLessonControlsProps = {
  micEnabled: boolean;
  subtitlesEnabled: boolean;
  micDisabled?: boolean;
  endCallDisabled?: boolean;
  onToggleMic: () => void;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
};

export function AudioLessonControls({
  micEnabled,
  subtitlesEnabled,
  micDisabled = false,
  endCallDisabled = false,
  onToggleMic,
  onToggleSubtitles,
  onEndCall,
}: AudioLessonControlsProps) {
  return (
    <View className="flex-row items-start justify-center gap-8 px-6 py-4">
      <ControlButton
        label="Mic"
        icon={micEnabled ? "mic" : "mic-off"}
        onPress={onToggleMic}
        active={micEnabled}
        disabled={micDisabled}
      />
      <ControlButton
        label="Subtitles"
        icon="language"
        onPress={onToggleSubtitles}
        active={subtitlesEnabled}
      />
      <EndCallButton onPress={onEndCall} disabled={endCallDisabled} />
    </View>
  );
}

function ControlButton({
  label,
  icon,
  onPress,
  active = true,
  disabled = false,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="items-center active:opacity-80"
    >
      <View
        className={`h-14 w-14 items-center justify-center rounded-full border border-border bg-white ${
          active ? "" : "opacity-80"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <Ionicons name={icon} size={24} color="#0D132B" />
      </View>
      <Text className="text-caption mt-2 text-text-secondary">{label}</Text>
    </Pressable>
  );
}

function EndCallButton({
  onPress,
  disabled = false,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="End lesson"
      className={`items-center active:opacity-85 ${disabled ? "opacity-50" : ""}`}
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-error">
        <Ionicons name="call" size={24} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
      </View>
      <Text className="text-caption mt-2 text-text-secondary">End Call</Text>
    </Pressable>
  );
}

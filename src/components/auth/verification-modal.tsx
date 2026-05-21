import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  isVerifying?: boolean;
};

export function VerificationModal({
  visible,
  onClose,
  onVerify,
  isVerifying = false,
}: VerificationModalProps) {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!visible) {
      setCode("");
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (code.length !== CODE_LENGTH || isVerifying) {
      return;
    }

    void onVerify(code).catch(() => {
      setCode("");
    });
  }, [code, isVerifying, onVerify]);

  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? "");

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          className="bg-black/40 opacity-50"
          onPress={onClose}
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-white px-6 pb-8 pt-6">
              <Text className="text-h3 text-text-primary">Check your email</Text>
              <Text className="text-body-medium mt-2 text-text-secondary">
                We&apos;ve sent a verification code to your email. Enter the 6-digit code
                below to continue.
              </Text>

              <Pressable
                className="mt-6 flex-row justify-between gap-2"
                onPress={() => inputRef.current?.focus()}
              >
                {digits.map((digit, index) => (
                  <View
                    key={index}
                    className={`h-14 flex-1 items-center justify-center rounded-xl border ${
                      digit ? "border-lingua-purple bg-[#F5F3FF]" : "border-border bg-white"
                    }`}
                  >
                    <Text className="text-h3 text-text-primary">{digit}</Text>
                  </View>
                ))}
              </Pressable>

              {isVerifying ? (
                <View className="mt-4 items-center">
                  <ActivityIndicator color="#6C4EF5" />
                </View>
              ) : null}

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={(text) =>
                  setCode(text.replace(/\D/g, "").slice(0, CODE_LENGTH))
                }
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                editable={!isVerifying}
                style={{
                  position: "absolute",
                  opacity: 0,
                  height: 1,
                  width: 1,
                }}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

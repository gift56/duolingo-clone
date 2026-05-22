import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const submittedRef = useRef(false);
  const [code, setCode] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCode("");
      setKeyboardHeight(0);
      submittedRef.current = false;
      return;
    }

    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    const timer = setTimeout(() => inputRef.current?.focus(), 300);

    return () => {
      clearTimeout(timer);
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  useEffect(() => {
    if (code.length !== CODE_LENGTH || isVerifying || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    Keyboard.dismiss();

    void onVerify(code).catch(() => {
      setCode("");
      submittedRef.current = false;
      inputRef.current?.focus();
    });
  }, [code, isVerifying, onVerify]);

  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? "");

  const sheetBottomOffset =
    keyboardHeight > 0 ? keyboardHeight : Math.max(insets.bottom, 16);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={[styles.sheetContainer, { paddingBottom: sheetBottomOffset }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheet}>
              <Text className="text-h3 text-text-primary">Check your email</Text>
              <Text className="text-body-medium mt-2 text-text-secondary">
                We&apos;ve sent a verification code to your email. Enter the 6-digit code
                below to continue.
              </Text>

              <Pressable
                style={styles.codeRow}
                onPress={() => !isVerifying && inputRef.current?.focus()}
              >
                {digits.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      styles.codeCell,
                      digit ? styles.codeCellFilled : styles.codeCellEmpty,
                    ]}
                  >
                    <Text className="text-h3 text-text-primary">{digit}</Text>
                  </View>
                ))}
              </Pressable>

              <View style={styles.loaderSlot}>
                {isVerifying ? <ActivityIndicator color="#6C4EF5" /> : null}
              </View>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={(text) => {
                  if (isVerifying) return;
                  const next = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
                  setCode(next);
                  if (next.length === CODE_LENGTH) {
                    Keyboard.dismiss();
                  }
                }}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                editable={!isVerifying}
                blurOnSubmit={false}
                style={styles.hiddenInput}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 24,
  },
  codeCell: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  codeCellEmpty: {
    borderColor: "#E5E7EB",
    backgroundColor: "#ffffff",
  },
  codeCellFilled: {
    borderColor: "#6C4EF5",
    backgroundColor: "#F5F3FF",
  },
  loaderSlot: {
    height: 32,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
});

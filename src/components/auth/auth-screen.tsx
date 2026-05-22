import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSignIn, useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useCallback, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/auth/verification-modal";
import { images } from "@/constants/images";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { navigateAfterAuth } from "@/lib/auth-navigation";

type AuthScreenProps = {
  mode: "sign-up" | "sign-in";
};

function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  showToggle,
  onToggleSecure,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggleSecure?: () => void;
}) {
  return (
    <View className="rounded-2xl border border-border bg-white px-4 py-3">
      <Text className="text-caption text-text-secondary">{label}</Text>
      <View className="mt-1 flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          keyboardType={label === "Email" ? "email-address" : "default"}
          className="flex-1 text-body-large text-text-primary"
          style={{ padding: 0, margin: 0 }}
        />
        {showToggle ? (
          <Pressable onPress={onToggleSecure} hitSlop={8} accessibilityRole="button">
            <Ionicons
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function SocialButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center justify-center rounded-2xl border border-border bg-white py-3.5 active:opacity-90"
    >
      <View className="absolute left-5">{icon}</View>
      <Text className="text-body-medium text-text-primary">{label}</Text>
    </Pressable>
  );
}

function Divider() {
  return (
    <View className="my-6 flex-row items-center">
      <View className="h-px flex-1 bg-border" />
      <Text className="text-body-medium mx-4 text-text-secondary">or continue with</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signInWithGoogle } = useSocialAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingMfa, setPendingMfa] = useState(false);

  const isLoading =
    signUpFetchStatus === "fetching" || signInFetchStatus === "fetching" || isVerifying;

  const openVerification = () => setVerificationVisible(true);

  const handleSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
    });

    if (error) {
      Alert.alert("Sign up failed", error.message ?? "Please check your details and try again.");
      return;
    }

    const sendError = (await signUp.verifications.sendEmailCode()).error;
    if (sendError) {
      Alert.alert("Verification failed", sendError.message ?? "Could not send verification code.");
      return;
    }

    openVerification();
  };

  const handleSignIn = async () => {
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });

    if (error) {
      Alert.alert("Sign in failed", error.message ?? "Please check your email and try again.");
      return;
    }

    setPendingMfa(false);
    openVerification();
  };

  const handlePrimarySubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    if (isSignUp) {
      if (!password) {
        Alert.alert("Missing password", "Please enter a password.");
        return;
      }
      await handleSignUp();
      return;
    }

    await handleSignIn();
  };

  const handleVerify = useCallback(
    async (code: string) => {
      setIsVerifying(true);

      try {
        if (isSignUp) {
          const { error } = await signUp.verifications.verifyEmailCode({ code });
          if (error) {
            throw new Error(error.message ?? "Invalid verification code.");
          }

          if (signUp.status === "complete") {
            await signUp.finalize({
              navigate: ({ session, decorateUrl }) => {
                setVerificationVisible(false);
                navigateAfterAuth(router, decorateUrl, session);
              },
            });
          } else {
            throw new Error("Sign-up is not complete. Please try again.");
          }
          return;
        }

        if (pendingMfa) {
          await signIn.mfa.verifyEmailCode({ code });
        } else {
          const { error } = await signIn.emailCode.verifyCode({ code });
          if (error) {
            throw new Error(error.message ?? "Invalid verification code.");
          }
        }

        if (signIn.status === "needs_client_trust") {
          const emailCodeFactor = signIn.supportedSecondFactors?.find(
            (factor) => factor.strategy === "email_code",
          );

          if (emailCodeFactor) {
            await signIn.mfa.sendEmailCode();
            setPendingMfa(true);
            throw new Error("RESEND_MFA");
          }
        }

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
              setVerificationVisible(false);
              setPendingMfa(false);
              navigateAfterAuth(router, decorateUrl, session);
            },
          });
        } else {
          throw new Error("Sign-in is not complete. Please try again.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Verification failed.";
        if (message !== "RESEND_MFA") {
          Alert.alert("Verification failed", message);
        }
        throw err;
      } finally {
        setIsVerifying(false);
      }
    },
    [isSignUp, pendingMfa, router, signIn, signUp],
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="screen"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-6">
            <Pressable
              onPress={() => router.back()}
              className="mb-4 h-10 w-10 items-center justify-center active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={28} color="#0D132B" />
            </Pressable>

            <Text className="text-h2 text-text-primary">
              {isSignUp ? "Create your account" : "Welcome back"}
            </Text>
            <Text className="text-body-medium mt-2 text-text-secondary">
              {isSignUp
                ? "Start your language journey today ✨"
                : "Continue your language journey ✨"}
            </Text>

            <View className="mt-4 items-center">
              <Image
                source={images.mascotAuth}
                style={{ width: 200, height: 160 }}
                contentFit="contain"
              />
            </View>

            <View className="mt-2 gap-4">
              <AuthField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="alex@gmail.com"
              />
              {isSignUp ? (
                <AuthField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={showPassword}
                  showToggle
                  onToggleSecure={() => setShowPassword((v) => !v)}
                />
              ) : null}
            </View>

            {isSignUp ? (
              <View nativeID="clerk-captcha" style={{ height: 0, overflow: "hidden" }} />
            ) : null}

            <Pressable
              onPress={() => void handlePrimarySubmit()}
              disabled={isLoading}
              className="mt-6 w-full items-center justify-center rounded-2xl bg-lingua-purple py-4 active:opacity-90"
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-h4 text-white">{isSignUp ? "Sign Up" : "Sign In"}</Text>
              )}
            </Pressable>

            <Divider />

            <SocialButton
              icon={<FontAwesome5 name="google" size={20} color="#EA4335" />}
              label="Continue with Google"
              onPress={() => void signInWithGoogle()}
              disabled={isLoading}
            />

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="text-body-medium text-text-secondary">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </Text>
              <Link href={isSignUp ? "/sign-in" : "/sign-up"} asChild>
                <Pressable>
                  <Text
                    className="text-body-medium text-lingua-purple"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    {isSignUp ? "Log in" : "Sign up"}
                  </Text>
                </Pressable>
              </Link>
            </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <VerificationModal
        visible={verificationVisible}
        onClose={() => {
          setVerificationVisible(false);
          setPendingMfa(false);
        }}
        onVerify={handleVerify}
        isVerifying={isVerifying}
      />
    </>
  );
}

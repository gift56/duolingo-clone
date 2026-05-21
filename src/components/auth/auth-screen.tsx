import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import {
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
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [verificationVisible, setVerificationVisible] = useState(false);

  const openVerification = () => setVerificationVisible(true);

  return (
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

            <Pressable
              onPress={openVerification}
              className="mt-6 w-full items-center justify-center rounded-2xl bg-lingua-purple py-4 active:opacity-90"
            >
              <Text className="text-h4 text-white">{isSignUp ? "Sign Up" : "Sign In"}</Text>
            </Pressable>

            <Divider />

            <View className="gap-3">
              <SocialButton
                icon={<FontAwesome5 name="google" size={20} color="#EA4335" />}
                label="Continue with Google"
                onPress={openVerification}
              />
              <SocialButton
                icon={<FontAwesome5 name="facebook" size={20} color="#1877F2" />}
                label="Continue with Facebook"
                onPress={openVerification}
              />
              <SocialButton
                icon={<FontAwesome5 name="apple" size={22} color="#000000" />}
                label="Continue with Apple"
                onPress={openVerification}
              />
            </View>

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

      <VerificationModal
        visible={verificationVisible}
        onClose={() => setVerificationVisible(false)}
      />
    </SafeAreaView>
  );
}

import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useSocialAuth(onComplete?: () => void) {
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const redirectUrl = Linking.createURL("oauth-callback");

  const signInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        if (onComplete) {
          onComplete();
        } else {
          router.replace("/");
        }
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === "ERR_CANCELED" ||
        error.message?.includes("ERR_REQUEST_CANCELED") ||
        error.message?.includes("cancel")
      ) {
        return;
      }
      Alert.alert("Error", error.message ?? "Google sign-in failed");
      console.error("Google SSO error:", err);
    }
  };

  return { signInWithGoogle };
}

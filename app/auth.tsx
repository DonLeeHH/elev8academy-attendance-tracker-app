import { Button, SafeAreaView, Text, View } from "react-native";
import { getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();

  const handleSignIn = async () => {
  try {
    // Launch the hosted UI redirect flow with Google as the provider
    console.log("Initiating Google sign-in redirect...");
    await signInWithRedirect({ provider: "Google" });
    // Note: This function does not return after redirect; the app is redirected to the hosted UI
    const user = await getCurrentUser();
    console.log("User signed in");
    router.replace("/");

  } catch (error) {
    console.error("Error during Google sign-in redirect:", error);
  }
  };

  return (
    <SafeAreaView>
      <Button
        title="Sign in with Google"
        onPress={handleSignIn}
      />
    </SafeAreaView>
  );
}
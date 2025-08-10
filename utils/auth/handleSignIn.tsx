import { getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "expo-router";

const router = useRouter();

export default async function handleSignIn(): Promise<void> {
  try {
    // Launch the hosted UI redirect flow with Google as the provider
    console.log("Initiating Google sign-in redirect...");
    await signInWithRedirect({ provider: "Google" });
    // Note: This function does not return after redirect; the app is redirected to the hosted UI
    const user = await getCurrentUser();
    console.log("User signed in", user);
    router.replace("/");

  } catch (error) {
    console.error("Error during Google sign-in redirect:", error);
  }
  };

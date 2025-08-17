import { getCurrentUser, signInWithRedirect} from "aws-amplify/auth";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const router = useRouter();

export default async function handleSignIn(attendSessionId?: string): Promise<void> {
  try {
    // Launch the hosted UI redirect flow with Google as the provider
    console.log("Initiating Google sign-in redirect...");
    await signInWithRedirect({ 
      provider: "Google",
    });
    // Note: This function does not return after redirect; the app is redirected to the hosted UI
    const user = await getCurrentUser();
    console.log("User attributes:", user);
    if (attendSessionId) {
      console.log("TESTING")
      router.replace(`/?attendSessionId=${attendSessionId}`);
    } else {
      router.replace("/");
    }

  } catch (error) {
    console.error("Error during Google sign-in");
    router.replace("/auth?error=Error with sign-in");
  }
  };

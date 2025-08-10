import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { useRouter } from "expo-router";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import config from "./amplifyconfiguration.json";

Amplify.configure(config);

// ✅ Optional: log the actual redirect URIs in config
console.log("Amplify redirectSignIn:", config.oauth?.redirectSignIn);
console.log("Amplify redirectSignOut:", config.oauth?.redirectSignOut);

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace("/auth");
        } else {
          setLoading(false);
          console.log(user);
        }
      } catch {
        router.replace("/auth");
      }
    }
    checkUser();
  }, []);

   const handleSignOut = async (): Promise<void> => {
    try {
      console.log("Signing out...");
      await signOut();
      console.log("Sign out success");
      router.replace("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading session...</Text>
      </View>
    );
  }

return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome back!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
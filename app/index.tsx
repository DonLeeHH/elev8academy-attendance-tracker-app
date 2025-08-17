import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { useRouter } from "expo-router";
import { getCurrentUser} from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import handleSignOut from "@/utils/auth/handleSignOut";
import { useSearchParams } from "expo-router/build/hooks";
import { generateSession } from "@/utils/session/generateSession";
import ClassCard from "@/components/cards/ClassCard";

Amplify.configure(config);


export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (!user) {
            router.replace("/auth"); 
        } else {
          setLoading(false);
        }
      } catch {
        router.replace(`/auth`);
      }
    }
    const error = params.get("error") || params.get("error_description");
    if (error) {
      router.replace(`/auth?error=Error with sign-in`);
    }
    checkUser();
    
  }, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading session...</Text>
      </View>
    );
  }
  async function fetchSession() {
      const res = await generateSession({
        level: 'Sec3',
        subject: 'Physics',
        tutorEmail: 'donleehh420@gmail.com'
      });
  }

return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome back!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Go to QR Code" onPress={async () => await fetchSession()} />
      <ClassCard 
        level="Sec3" 
        subject="Physics" 
        tutorEmail="donleehh420@gmail.com" 
      />
    </View>
  );
}
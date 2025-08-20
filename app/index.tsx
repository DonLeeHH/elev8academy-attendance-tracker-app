import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getCurrentUser} from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import handleSignOut from "@/utils/auth/handleSignOut";
import { useSearchParams } from "expo-router/build/hooks";
import { generateSession } from "@/utils/session/generateSession";
import ClassCard from "@/components/cards/ClassCard";
import getUserGroups from "@/utils/auth/getUserGroups";
import AsyncStorage from "@react-native-async-storage/async-storage";

Amplify.configure(config);


export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();

  const { errorMessage } = useLocalSearchParams<{ errorMessage?: string }>();


  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (!user) {
            router.replace("/auth"); 
        } else {
          setLoading(false);
          const groups = await getUserGroups();
          try {
            const attendSessionId = await AsyncStorage.getItem('attendSessionId');
          
            if (attendSessionId !== null) {
              // value previously stored
              console.log("Routing to attendance screen with session ID:", attendSessionId);
              await AsyncStorage.removeItem('attendSessionId');
              router.push(`/attendance/attend?sessionId=${attendSessionId}`);
            } else {
              console.log("No attend session ID found, staying on index.");
            }
          } catch (e) {
            // error reading value
          }
        }
      } catch {
        router.replace(`/auth`);
      }
    }
    const error = params.get("error") || params.get("error_description"); // For web
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

return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome back!</Text>
      <Text style={{ color: "red" }}>{errorMessage}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <ClassCard 
        level="Sec3" 
        subject="Physics" 
        tutorEmail="donleehh420@gmail.com" 
      />
    </View>
  );
}
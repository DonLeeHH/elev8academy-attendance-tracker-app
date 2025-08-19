import { getCurrentUser } from "aws-amplify/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendScreen() {
    const router = useRouter();
    const {sessionId} = useLocalSearchParams<{sessionId: string}>();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async() => {
            try { 
                await getCurrentUser(); // throws if not signed in
                setChecking(false);
                // Check if user is student
            } catch { 
                // not signed in -> send to /auth with a "next" param so we can come back
                try {
                    await AsyncStorage.setItem('attendSessionId', sessionId);
                } catch {
                    console.error("Error saving session ID");
                }
                router.replace(`/auth`);
            }
        })();
    }, [router, sessionId]);
    if (checking) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text>Checking your session…</Text>
        </View>
        );
    }
    return (
        <View>
            <Text>Welcome to the attendance screen!</Text>
        </View>
    );
}
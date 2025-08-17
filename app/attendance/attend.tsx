import { getCurrentUser } from "aws-amplify/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";

export default function AttendScreen() {
    const router = useRouter();
    const {sessionId} = useLocalSearchParams<{sessionId: string}>();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async() => {
            try { 
                await getCurrentUser(); // thros if not signed in
                setChecking(false);
            } catch { 
                // not signed in -> send to /auth with a "next" param so we can come back
                router.replace(`/auth?attendSessionId=${sessionId}`);
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
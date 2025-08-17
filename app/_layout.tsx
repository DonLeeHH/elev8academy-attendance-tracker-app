import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="attendance" options={{ headerBackTitle: "Back", headerTitle: "" }} />
    </Stack>
  );
}

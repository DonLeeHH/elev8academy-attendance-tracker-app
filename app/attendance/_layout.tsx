import { Stack } from 'expo-router';

export default function AttendanceLayout() {

  return (
    <Stack screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="attend" />
      <Stack.Screen name="qr" />
    </Stack>
  );
}
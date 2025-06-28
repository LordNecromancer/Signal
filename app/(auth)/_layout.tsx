import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>

      <Stack.Screen name="signup" options={{ headerShown: false, headerLeft: () => null}} />
      <Stack.Screen name="login" options={{ headerShown: false, headerLeft: () => null}} />

    </Stack>
  );
}
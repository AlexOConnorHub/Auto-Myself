import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Auto Myself' }} />
      <Stack.Screen name="add" options={{ title: 'Add Vehicle' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Car Details' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Car Edit' }} />
      <Stack.Screen name="[id]/record/[id]/edit" options={{ title: 'Maintenance Record' }} />
    </Stack>
  );
}

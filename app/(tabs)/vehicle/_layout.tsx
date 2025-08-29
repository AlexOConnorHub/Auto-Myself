import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen name="[vehicle_id]/record/edit" options={{ title: 'Record Edit' }} />
      <Stack.Screen name="[vehicle_id]/record/add" options={{ title: 'Add Record' }} />
      <Stack.Screen name="[vehicle_id]/edit" options={{ title: 'Vehicle Edit' }} />
      <Stack.Screen name="[vehicle_id]/index" options={{ title: 'Vehicle Details' }} />
      <Stack.Screen name="add" options={{ title: 'Add Vehicle' }} />
      <Stack.Screen name="index" options={{ title: 'Auto Myself' }} />
    </Stack>
  );
}

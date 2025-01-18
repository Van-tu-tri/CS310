import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      <Stack.Screen name="register" options={{ headerShown: false }}/>
      <Stack.Screen name="(tabs)"  options= {{ headerShown: false}}/>
      <Stack.Screen name="message"  options= {{ headerShown: false}}/>
      <Stack.Screen name="createGroups"  options= {{ headerShown: false}}/>
      <Stack.Screen name="groupmessage"  options= {{ headerShown: false}}/>
      <Stack.Screen name="addmember"  options= {{ headerShown: false}}/>
      <Stack.Screen name="groupdetails"  options= {{ headerShown: false}}/>
    </Stack>
  );
}
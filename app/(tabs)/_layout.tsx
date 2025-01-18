import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Tabs
        screenOptions={{
        tabBarActiveTintColor: 'hotpink',
        }}
    >
        <Tabs.Screen name="friends" 
        options={{ 
            headerShown: false,
            title: "Friends",
            tabBarIcon: ({ color, focused }) => (
                <AntDesign name="user" color={color} size={24} />
            ),
        }}
        />
        <Tabs.Screen name="groups" 
        options={{ 
            headerShown: false,
            title: "Groups",
            tabBarIcon: ({ color, focused }) => (
                <AntDesign name="team" color={color} size={24} />
            ),
        }}
        />
        <Tabs.Screen name="add" 
        options={{ 
            headerShown: false,
            title: "Add",
            tabBarIcon: ({ color, focused }) => (
                <AntDesign name="search1" color={color} size={24} />
            ),
        }}
        />
        <Tabs.Screen name="pending" 
        options={{ 
            headerShown: false,
            title: "Pending List",
            tabBarIcon: ({ color, focused }) => (
                <AntDesign name="pluscircleo" color={color} size={24} />
            ),
        }}
        />
        <Tabs.Screen name="logout" 
        options={{ 
            headerShown: false,
            title: "Logout",
            tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons name="exit-to-app" color={color} size={24} />
            ),
        }}
        />
    </Tabs>
  );
}
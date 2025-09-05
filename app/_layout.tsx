import FloatingAI from "@/components/floatingAI";
import { AiProvider } from '@/contexts/aiContext';
import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AiProvider>
        <StatusBar hidden={true} />
        <FloatingAI />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movies/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AiProvider>  
    </AuthProvider>
  );
}

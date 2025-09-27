import '../src/utils/polyfills';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { installGlobalErrorHandlers } from '../src/utils/globalErrors';

installGlobalErrorHandlers();
// Initialize i18n before other imports
import '../src/i18n';
// Keep the rest of the file below
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from "@hooks/useColorScheme";
import ReanimatedConfig from "@/components/ReanimatedConfig";
import { AuthProvider } from "@/src/context/AuthContext";
import { FavoritesProvider } from "@/src/context/FavoritesContext";
import { FilterProvider } from "@/src/context/FilterContext";
import { ThemeProvider } from "@/src/context/ThemeContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent auto-hide early, but do not let it crash
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  console.log('_layout: RootLayoutNav rendering');
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider defaultMode="system">
      <AuthProvider>
        <FavoritesProvider>
          <FilterProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>

                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ presentation: "modal", headerShown: false }}
                  />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="chatScreen" options={{ headerShown: false }} />
                  <Stack.Screen name="placeDetails" options={{ headerShown: false }} />
                  <Stack.Screen 
                    name="dashboard" 
                    options={{ 
                      headerShown: false,
                      title: "Admin Dashboard"
                    }} 
                  />
                  <Stack.Screen name="admin-login" options={{ headerShown: false }} />
                  <Stack.Screen 
                    name="analytics-test" 
                    options={{ 
                      headerShown: false,
                      title: "Analytics Test"
                    }} 
                  />
                </Stack>
              </NavigationThemeProvider>
            </GestureHandlerRootView>
          </FilterProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

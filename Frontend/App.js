import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Import your screens
import StartPage from "./components/StartPage";
import UserRegister from "./components/UserRegister";
import FrontPage from "./components/FrontPage";
import UserLogin from "./components/UserLogin";
import Classifier from "./components/Classifier";

// Import more robust font options
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold, // Added semi-bold for better visibility
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Menu from "./components/Menu";
import Inquiry from "./components/Inquiry";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold, // Added instead of Thin
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fa" />
      <Stack.Navigator
        initialRouteName="FrontPage"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen name="StartPage" component={StartPage} />
        <Stack.Screen name="UserRegister" component={UserRegister} />
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="Classifier" component={Classifier} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Inquiry" component={Inquiry} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

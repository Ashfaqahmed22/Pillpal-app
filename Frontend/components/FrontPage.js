import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, Animated } from "react-native";

const FrontPage = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("StartPage");
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require("../assets/heartbeat.png")}
            style={styles.heartbeatIcon}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text style={styles.appTitle}>Pill Pal</Text>
      <Text style={styles.appTagline}>Your Pill Identifier</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heartbeatIcon: {
    width: 60,
    height: 60,
    tintColor: "#4ECDC4",
  },
  appTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 33,
    color: "#fff",
    marginTop: 20,
  },
  appTagline: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    color: "#fff",
    marginTop: 10,
  },
});

export default FrontPage;

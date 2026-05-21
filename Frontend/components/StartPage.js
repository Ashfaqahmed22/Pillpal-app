import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

const StartPage = ({ navigation }) => {
  // Navigate to UserRegister page
  const goToSignUp = () => {
    navigation.navigate("UserRegister");
  };

  // Navigate to Login page
  const goToSignIn = () => {
    navigation.navigate("UserLogin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/doctor.png")}
            style={styles.doctorImage}
            resizeMode="contain"
          />
        </View>

        {/* Text section */}
        <View style={styles.textSection}>
          <Text style={styles.heading}>Let's Get Started!</Text>
          <Text style={styles.subheading}>
            Sign in to enjoy the features we've prepared, and stay healthy!
          </Text>
        </View>

        {/* Buttons section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={goToSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={goToSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fa",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  imageContainer: {
    width: "100%",
    height: 320,
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorImage: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#333333",
    marginBottom: 16,
  },
  subheading: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: "#23B5B5",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    borderRadius: 30,
    elevation: 2,
  },
  signUpText: {
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    elevation: 2,
  },
  signInText: {
    fontFamily: "Poppins-Medium",
    color: "#333333",
    fontSize: 16,
  },
});

export default StartPage;

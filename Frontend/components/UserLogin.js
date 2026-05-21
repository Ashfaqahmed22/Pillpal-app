import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ref,
  get,
  push,
  set,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "../config/FirebaseConfig";

const UserLogin = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Go back to the previous screen
  const goBack = () => {
    navigation.goBack();
  };

  // Navigate to register page
  const goToRegister = () => {
    navigation.navigate("UserRegister");
  };

  // Handle Login
  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    try {
      const userRef = query(
        ref(database, "userRegister"),
        orderByChild("fullName"),
        equalTo(userName)
      );
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.values(users)[0];

        if (user.password === password) {
          Alert.alert("Success", "Login successful!");
          const loginRef = ref(database, "userLogin");
          const newLoginRef = push(loginRef);
          await set(newLoginRef, {
            userName: user.fullName,
            password: user.password,
            loginTime: new Date().toISOString(),
          });

          setUserName("");
          setPassword("");
          navigation.navigate("Menu");
        } else {
          Alert.alert("Error", "Incorrect password. Please try again.");
        }
      } else {
        Alert.alert(
          "Not Registered",
          "No account found with this username. Please register first."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify login details. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Let's Sign you in.</Text>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.missedText}>You've been missed!</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Username"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.accountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={goToRegister}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#333333",
    marginBottom: 4,
  },
  welcomeText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#999999",
    marginBottom: 2,
  },
  missedText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#999999",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#333333",
    marginBottom: 6,
  },
  input: {
    fontFamily: "Poppins-Regular",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    backgroundColor: "#ffffff",
  },
  passwordInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333333",
  },
  eyeIcon: {
    padding: 12,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  accountText: {
    fontFamily: "Poppins-Regular",
    color: "#666666",
    fontSize: 14,
  },
  registerLink: {
    fontFamily: "Poppins-Medium",
    color: "#4ECDC4",
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  loginButtonText: {
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
    fontSize: 17,
  },
});

export default UserLogin;

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
import { database, ref, set, push, get, child } from "../config/FirebaseConfig"; // Import Firebase functions

const UserRegister = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Go back to previous screen
  const goBack = () => {
    navigation.goBack();
  };

  // Navigate to login page
  const goToLogin = () => {
    navigation.navigate("UserLogin");
  };

  // Handle registration
  const handleRegister = () => {
    // Basic validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Check if the user is already registered
    const usersRef = ref(database, "userRegister");
    get(usersRef)
      .then((snapshot) => {
        const users = snapshot.val();
        let emailExists = false;
        // Check if the email already exists in the database
        for (let id in users) {
          if (users[id].email === email) {
            emailExists = true;
            break;
          }
        }

        if (emailExists) {
          Alert.alert("Error", "Already registered. Please login.");
        } else {
          // Proceed with registration and save the user data to Firebase
          const userRef = push(ref(database, "userRegister"));
          set(userRef, {
            fullName,
            email,
            password,
          })
            .then(() => {
              Alert.alert("Success", "Registration successful!");
              setFullName(""); // Clear fields after registration
              setEmail("");
              setPassword("");
              navigation.navigate("Menu", { userName: fullName });
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
            });
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
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
            <Text style={styles.title}>Create New Account</Text>
            <Text style={styles.subtitle}>Sign in to learn better</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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

            <View style={styles.loginContainer}>
              <Text style={styles.accountText}>Do you have an account? </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Register</Text>
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
    marginTop: 5,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 25,
    color: "#333333",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#666666",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#333333",
    marginBottom: 7,
  },
  input: {
    fontFamily: "Poppins-Regular",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  accountText: {
    fontFamily: "Poppins-Regular",
    color: "#666666",
    fontSize: 15,
  },
  loginLink: {
    fontFamily: "Poppins-Medium",
    color: "#4ECDC4",
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  registerButtonText: {
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
    fontSize: 17,
  },
});

export default UserRegister;

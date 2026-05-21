import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const InquiryScreen = () => {
  const navigation = useNavigation();
  const db = getDatabase();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const handleSubmit = () => {
    if (!name || !number || !message || !idNumber) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    // Save data to Firebase Realtime Database
    push(ref(db, "inquiry"), {
      name,
      number,
      message,
      idNumber,
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        Alert.alert("Success", "Inquiry submitted successfully!");
        setName("");
        setNumber("");
        setMessage("");
        setIdNumber("");
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Inquiry</Text>
      </View>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={number}
        onChangeText={setNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Number"
        keyboardType="numeric"
        value={idNumber}
        onChangeText={setIdNumber}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginTop: -30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    position: "relative",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4ECDC4",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
});

export default InquiryScreen;

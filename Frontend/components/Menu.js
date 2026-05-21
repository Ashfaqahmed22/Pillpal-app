import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Menu = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack();
  };

  const goToClassifier = () => {
    navigation.navigate("Classifier");
  };

  const goToInquiry = () => {
    navigation.navigate("Inquiry");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Menu</Text>

        <Image source={require("../assets/doc.png")} style={styles.imageBox} />

        <TouchableOpacity style={styles.button} onPress={goToClassifier}>
          <Text style={styles.buttonText}>Identify</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={goToInquiry}>
          <Text style={styles.buttonText}>Inquiry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  header: {
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    marginTop: -60,
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#333333",
    marginBottom: 30,
  },
  imageBox: {
    width: 300,
    height: 300,
    borderRadius: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4ECDC4",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginVertical: 8,
    width: "80%",
    elevation: 2,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
    fontSize: 17,
  },
});

export default Menu;

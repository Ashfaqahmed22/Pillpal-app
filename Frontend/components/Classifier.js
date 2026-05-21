import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function PillClassifier({ navigation }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [pillData, setPillData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request camera permissions on component mount
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to use this feature"
        );
      }
    })();
  }, []);

  const pickImage = async (fromCamera) => {
    try {
      // Set loading to prevent multiple taps
      setLoading(true);
      setPillData(null); // Clear any previous pill data

      let options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };

      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      // Check if the user canceled the operation
      if (result.canceled || !result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      // Set the captured image
      setCapturedImage(result.assets[0].uri);

      await classifyPill(result.assets[0].uri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to capture or select image.");
      setLoading(false);
    }
  };

  const classifyPill = async (imageUri) => {
    try {
      setPillData(null);

      let formData = new FormData();
      const filename = imageUri.split("/").pop();

      formData.append("file", {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        name: filename || "pill.jpg",
        type: "image/jpeg",
      });

      console.log("Sending request to API...");

      const response = await axios.post(
        "http://192.168.8.121:5000/identify_pill", // enter your ipv4 address here
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 20000,
        }
      );

      console.log("Raw API Response:", JSON.stringify(response.data));

      const responseData = response.data.data || response.data;

      console.log(
        "Response structure to analyze:",
        JSON.stringify(responseData)
      );

      const keys = Object.keys(responseData);

      if (keys.length > 0) {
        const possibleDrugName = keys[0];

        if (
          responseData[possibleDrugName] &&
          typeof responseData[possibleDrugName] === "object" &&
          responseData[possibleDrugName].Imprint
        ) {
          const drugDetails = responseData[possibleDrugName];

          const pillInfo = {
            name: possibleDrugName,
            ...drugDetails,
          };

          console.log("Processed pill data:", JSON.stringify(pillInfo));
          setPillData(pillInfo);
        } else {
          console.log("Using response data as is");
          setPillData(responseData);
        }
      } else {
        console.log("No keys found in response data");
        setPillData(responseData);
      }
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error details:", error.message);

      if (error.response) {
        console.error("Error response:", error.response.data);
      }

      Alert.alert(
        "Error",
        "Failed to identify pill. Please try again with a clearer image."
      );
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPillData(null);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Pill Identifier</Text>
      </View>

      <View style={styles.previewContainer}>
        {capturedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.image} />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearImage}
              disabled={loading}
            >
              <MaterialIcons name="close" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="camera-alt" size={30} color="#666" />
            <Text style={styles.previewText}>Camera Preview</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cameraButton,
            loading && styles.disabledButton,
          ]}
          onPress={() => pickImage(true)}
          disabled={loading}
        >
          <MaterialIcons name="camera-alt" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.galleryButton,
            loading && styles.disabledButton,
          ]}
          onPress={() => pickImage(false)}
          disabled={loading}
        >
          <MaterialIcons name="photo-library" size={20} color="#000" />
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      {pillData && (
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Pill Information</Text>

          {pillData.name && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Name:</Text>
              <Text style={styles.detailsValue}>{pillData.name}</Text>
            </View>
          )}

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Imprint:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Imprint || "Unknown"}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Strength:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Strength || "Unknown"}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Color:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Color || "Unknown"}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Shape:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Shape || "Unknown"}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Availability:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Availability || "Unknown"}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Uses:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Uses || "Unknown"}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Labeler:</Text>
            <Text style={styles.detailsValue}>
              {pillData.Labeler || "Unknown"}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
    marginTop: -30,
    position: "relative",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 15,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  previewContainer: {
    width: 300,
    height: 250,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  previewText: {
    marginTop: 10,
    color: "#666",
    fontFamily: "Poppins-regular",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  clearButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    elevation: 2,
  },
  cameraButton: {
    backgroundColor: "#4ECDC4",
  },
  galleryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,

    marginLeft: 8,
    fontFamily: "Poppins-regular",
  },
  galleryButtonText: {
    color: "#000",
    fontSize: 16,

    marginLeft: 8,
    fontFamily: "Poppins-regular",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontFamily: "Poppins-regular",
  },
  detailsContainer: {
    marginTop: 20,
    padding: 17,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 5,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 9,
  },
  detailsLabel: {
    fontSize: 15,
    fontWeight: "bold",
    width: "30%",
    color: "#555",
    fontFamily: "Poppins-regular",
  },
  detailsValue: {
    fontSize: 15,
    flex: 1,
    color: "#333",
    fontFamily: "Poppins-regular",
  },
});

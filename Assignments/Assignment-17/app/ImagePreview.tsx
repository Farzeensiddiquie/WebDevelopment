// app/ImagePreview.tsx
import { useLocalSearchParams, router } from "expo-router";
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ImagePreview() {
  const { uri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      {/* Fullscreen Image */}
      <Image source={{ uri: uri as string }} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width,
    height,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  closeText: {
    fontSize: 28,
    color: "#fff",
  },
});

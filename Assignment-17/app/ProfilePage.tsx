import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover and Avatar */}
        <View style={styles.hero}>
          <View style={styles.cover} />
          <Image
            source={{ uri: "https://i.pravatar.cc/300?img=7" }}
            style={styles.avatar}
          />
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Farzeen Siddiquie</Text>
          <Text style={styles.email}>farzeen@example.com</Text>
          <Text style={styles.bio}>
            React Native craftsman. Building clean apps with Expo, Firebase, Redux, and love.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>290</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Optional Spacer */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 12,
  },
  arrow: {
    fontSize: 28,
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  hero: {
    alignItems: "center",
    marginBottom: 70,
  },
  cover: {
    height: 160,
    width: "100%",
    backgroundColor: "#126CFF",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#fff",
    borderWidth: 4,
    position: "absolute",
    top: 110,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  email: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: "#444",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 35,
    paddingVertical: 18,
    marginHorizontal: 16,
    width: screenWidth - 32,
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});

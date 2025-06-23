import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchTab() {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Back</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',       // horizontal layout
    alignItems: 'center',       // vertical center
  },
  arrow: {
    transform: [{ scaleX: -1 }], // mirror horizontally
    fontSize: 24,
    marginRight: 8,             // space between arrow and text
  },
  label: {
    fontSize: 18,
    color: '#000',              // optional text styling
  },
});

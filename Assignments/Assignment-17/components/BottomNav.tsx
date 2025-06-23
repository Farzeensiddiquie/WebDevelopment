import { router, usePathname } from "expo-router";
import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { IconSymbol, IconSymbolName } from "./ui/IconSymbol";

const tabs: {
  icon: IconSymbolName;
  route: "/" | "/watch" | "/market" | "/groups" | "/gaming";
}[] = [
  { icon: "house.fill", route: "/" },
  { icon: "tv.fill", route: "/watch" },
  { icon: "bag.fill", route: "/market" },
  { icon: "person.2.fill", route: "/groups" },
  { icon: "gamecontroller.fill", route: "/gaming" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} onPress={() => router.push(tab.route)}>
          <IconSymbol
            name={tab.icon}
            size={30}
            color={pathname === tab.route ? "#1877f2" : "#666"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

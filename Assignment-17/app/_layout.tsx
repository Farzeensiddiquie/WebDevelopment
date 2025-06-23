import BottomNav from "@/components/BottomNav";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, Slot, usePathname } from "expo-router";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/Store"; 
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePreview from "./ImagePreview";


const TOP_NAV_HEIGHT = Platform.OS === "ios" ? 100 : 70;
const BOTTOM_NAV_HEIGHT = 60;
const SCROLL_THRESHOLD = 10;

// List of tab screens that should act as regular screens (with back arrow, no nav)
const hideNavRoutes = ["/AddTab", "/SearchTab", "/MessageTab","/ProfilePage", "/ImagePreview"];

export default function Layout() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const combinedNavTranslateY = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = currentScrollY > lastScrollY.current ? "down" : "up";

    if (Math.abs(currentScrollY - lastScrollY.current) > SCROLL_THRESHOLD) {
      Animated.spring(combinedNavTranslateY, {
        toValue: scrollDirection === "down" ? -TOP_NAV_HEIGHT : 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  // Check if current route is one of the tab screens to hide nav
  const isTabScreen = hideNavRoutes.includes(pathname);

  return (
        <Provider store={store}>

    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        {/* Hide nav for tab screens */}
        {!isTabScreen && (
          pathname === "/" ? (
            <Animated.View
              style={[
                styles.combinedNav,
                {
                  transform: [{ translateY: combinedNavTranslateY }],
                },
              ]}
            >
              {/* Top Nav */}
              <View style={styles.topNav}>
                <Text style={styles.logo}>facebook</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => router.push("/AddTab")} style={styles.iconCircleBlack}>
                    <IconSymbol name="plus.circle.fill" size={27} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/SearchTab")} style={styles.iconCircle}>
                    <IconSymbol name="magnifyingglass" size={27} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/MessageTab")} style={styles.iconCircle}>
                    <IconSymbol name="message.fill" size={27} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Bottom Nav */}
              <BottomNav />
            </Animated.View>
          ) : (
            <View style={[styles.combinedNav, { transform: [{ translateY: 0 }] }]}>
              {/* Only Bottom Nav for other tabs */}
              <BottomNav />
            </View>
          )
        )}

        {/* Page Content */}
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop:
              !isTabScreen && pathname === "/"
                ? TOP_NAV_HEIGHT + BOTTOM_NAV_HEIGHT
                : !isTabScreen
                ? BOTTOM_NAV_HEIGHT
                : 0, // No padding for tab screens
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          onScrollEndDrag={!isTabScreen && pathname === "/" ? handleScroll : undefined}
          onMomentumScrollEnd={!isTabScreen && pathname === "/" ? handleScroll : undefined}
        >
          <Slot />
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  combinedNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 10 : 28,
    paddingHorizontal: 12,
    paddingBottom: 7,
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#126cff",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    backgroundColor: "#e4e6eb",
    borderRadius: 16,
    padding: 6,
  },
  iconCircleBlack: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 6,
  },
});
import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/PostSlice"; // adjust path if needed
import { AppDispatch, RootState } from "../store/Store"; // adjust path
import PostCard from "./PostCard";

export default function Posts() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: posts, status, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#126CFF" />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {posts.map((post) => (
        <PostCard key={post.id} postData={post} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface PostData {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export default function PostCard({ postData }: { postData: PostData }) {
  const [liked, setLiked] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const imageUri =
    "https://images.unsplash.com/photo-1743883986262-7b46a76c0261?q=80&w=1470&auto=format&fit=crop";

  const MAX_LENGTH = 120;
  const isLongText = postData.body.length > MAX_LENGTH;
  const displayedBody = showFullText
    ? postData.body
    : postData.body.slice(0, MAX_LENGTH);

  return (
    <View style={styles.card}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn}>
        <Text style={styles.closeText}> ×</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>Farzeen Siddiquie</Text>
          <Text style={styles.timestamp}>2 hrs ago</Text>
        </View>
      </View>

      {/* Post Title */}
      <Text style={styles.content}>{postData.title}</Text>

      {/* Post Body */}
      <Text style={[styles.content, { marginBottom: 4 }]}>
  {displayedBody}
  {isLongText && !showFullText && "..."}
  {isLongText && (
    <Text
      style={styles.seeMore}
      onPress={() => setShowFullText(!showFullText)}
    >
      {showFullText ? " See less" : " See more"}
    </Text>
  )}
</Text>


      {/* Tags */}
      <View style={styles.tagContainer}>
        {postData.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      {/* Post Image */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/ImagePreview",
            params: { uri: imageUri },
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.postImage} />
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setLiked(!liked)}
        >
          <Text style={[styles.actionText, liked && styles.active]}>
            {liked
              ? `👍 ${postData.reactions.likes + 1} Liked`
              : `👍 ${postData.reactions.likes} Like`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>↗️ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D5D7D9",
    position: "relative",
    borderBottomColor: "#D5D7D9",
    borderBottomWidth: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 14,
    zIndex: 2,
  },
  closeText: {
    fontSize: 32,
    color: "#888",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
  },
  content: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  seeMore: {
    color: " #6282bf",
    fontWeight: "500",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  tag: {
    marginRight: 8,
    color: "#126CFF",
    fontWeight: "600",
    fontSize: 13,
  },
  postImage: {
    width: width,
    height: 380,
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  active: {
    color: "#126CFF",
    fontWeight: "700",
  },
});

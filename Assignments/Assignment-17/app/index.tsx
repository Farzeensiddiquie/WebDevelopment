import Posts from "@/components/Posts";
import StorySection from "@/components/StorySection";
import SubHeader from "@/components/SubHeader";
import React from "react";

import { ScrollView } from "react-native";

export default function Home() {
  return (
    <ScrollView style={{ marginTop: 10 }}>
      <SubHeader />
      <StorySection />
      <Posts/>
    </ScrollView>
  );
}

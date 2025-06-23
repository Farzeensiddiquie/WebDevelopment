import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";

export class StorySection extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 230,
          borderBottomColor: "#D5D7D9",
          borderBottomWidth: 6,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          >
         
            <Image
                  
              source={require("../assets/images/StoryImg.jpg")}
              style={{
                width: 105,
                height: 205,
                borderRadius: 10,
                marginLeft: 20,
              }}
            />
         
        </TouchableOpacity>
      </View>
    );
  }
}

export default StorySection;

import { router } from "expo-router";
import React, { Component } from "react";
import { Text, TextInput, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
export class SubHeader extends Component {
  render() {
    return (
      <View
        style={{
          height: 65,
          backgroundColor: "#ffff",
          borderBottomColor: "#D5D7D9",
          borderBottomWidth: 5,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity  onPress={() => router.push("/ProfilePage")}>
        <View 
          style={{
            backgroundColor: "#D6D9DD",
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            
    marginLeft: 12,
          }}
        >
          <Icon name="user" size={30} color="#696C70" />
        </View>
        </TouchableOpacity>
        <View>
          <TextInput
            style={{
              padding: 0,
              fontWeight: 500,
              color: "#0000",
              paddingLeft: 20,
              borderWidth: 1,
              marginLeft: 20,
              width: 250,
              borderColor: "#D5D7D9",
              height: 35,
              borderRadius: 25,
              fontSize: 16,
            }}
            id="Search"
            placeholder="What's on your mind?"
          />
        </View>
        <View>
          <TouchableOpacity>
      <Image
        source={require("../assets/images/file.png")}
style={{left:15}}
        resizeMode="cover"
      />
      </TouchableOpacity>

        </View>
      </View>
    );
  }
}

export default SubHeader;

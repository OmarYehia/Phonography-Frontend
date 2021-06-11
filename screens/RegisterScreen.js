import React from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function RegisterScreen() {
  return (
    <View
      style={{
        ...globalStyles.container,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text style={globalStyles.titleText}> Register Component </Text>
    </View>
  );
}

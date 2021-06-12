import React from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function Home() {
  return (
    <View
      style={{
        ...globalStyles.container,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text style={globalStyles.titleText}> Home Component </Text>
    </View>
  );
}

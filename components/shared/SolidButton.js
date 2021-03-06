import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function SolidButton({
  text,
  onPress,
  width = "100%",
  color = "#f01d71",
  borderRadius = 16,
  fontColor = "white",
}) {
  const styles = StyleSheet.create({
    button: {
      marginTop: 20,
      borderRadius: borderRadius,
      paddingVertical: 14,
      paddingHorizontal: 10,
      backgroundColor: color,
      width: width,
      alignSelf: "center",
      elevation: 2,
    },
    buttonText: {
      color: fontColor,
      textTransform: "capitalize",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "nunito-bold",
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

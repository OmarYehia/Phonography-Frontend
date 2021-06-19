import React from "react";
import { Text, StyleSheet, View } from "react-native";
import CategoryList from "../components/Category/CategoryList";
import { globalStyles } from "../styles/global";

export default function CategoriesScreen() {
  return (
    <View style={{ ...globalStyles.container, ...styles.container }}>
      <Text style={{ ...globalStyles.titleText, ...styles.title }}>Categories</Text>
      <CategoryList />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    fontSize: 20,
  },
  container: {
    paddingHorizontal: 5,
  },
});

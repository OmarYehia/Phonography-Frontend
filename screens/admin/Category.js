import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../../components/shared/Header";
import CategoryForm from "./CategoryForm";

const Stack = createStackNavigator();

const WideButton = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const MainController = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <WideButton text="Create Category" onPress={() => navigation.navigate("Create Category")} />
    <WideButton text="Edit Category" />
  </View>
);

export default function CategoryController({ route }) {
  const state = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStatusBarHeight: 50,
        headerTintColor: "#444",
      }}>
      <Stack.Screen
        name="create"
        component={MainController}
        options={({ navigation }) => {
          return {
            headerTitle: () => <Header navigation={navigation} title="Category Controller" />,
          };
        }}
      />
      <Stack.Screen name="Create Category" component={CategoryForm} initialParams={state} />
      {/* <Stack.Screen name="Edit Category" component={null} /> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#f01d71",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.9,
    height: 170,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textTransform: "capitalize",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "nunito-bold",
  },
});

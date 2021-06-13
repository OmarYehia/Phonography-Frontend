import React, { useContext } from "react";
import { Text, View, Button } from "react-native";
import { globalStyles } from "../styles/global";
import { AuthContext } from "../context/AuthContext";

export default function Home({ route }) {
  const { signOut } = useContext(AuthContext);
  return (
    <View
      style={{
        ...globalStyles.container,
        alignItems: "center",
        justifyContent: "center",
      }}>
      {console.log(route.params)}
      <Text style={globalStyles.titleText}>token={route.params.userToken}</Text>
      <Button title="sign out" onPress={signOut} />
    </View>
  );
}

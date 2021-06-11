import React, { useContext, useState } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);
  return (
    <ImageBackground source={require("../assets/splash.png")} style={styles.backgroundRegister}>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.inputFieldsContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={{ ...styles.inputGroup, ...styles.passwordGroup }}>
            <TextInput
              style={{ ...styles.input, flex: 1, borderBottomWidth: 0 }}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Ionicons name="eye-sharp" size={22} color="#aaa" />
          </View>

          <View style={styles.submitBtnContainer}>
            <TouchableOpacity style={styles.submitBtn} onPress={() => signIn({ email, password })}>
              <Text style={styles.submitBtnText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text>Forgot password?</Text>

          <View style={styles.bottomContainer}>
            <Text>Don't have an account?</Text>
            <Text styles={styles.textLink}>Create an account.</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundRegister: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  formContainer: {
    padding: 30,
    flex: 1,
  },
  title: {
    marginTop: 90,
    marginBottom: 120,
    fontSize: 28,
    fontWeight: "bold",
  },
  inputFieldsContainer: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    // backgroundColor: "pink",
    marginVertical: 13,
  },
  passwordGroup: {
    flexDirection: "row",
    alignItems: "center",
    // flex: 1,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  input: {
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    paddingBottom: 6,
    paddingTop: 10,
  },
});

import React, { useContext, useState } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import SolidButton from "../components/shared/SolidButton";
import { globalStyles } from "../styles/global";
import { Formik } from "formik";
import * as yup from "yup";
import Spinner from "react-native-loading-spinner-overlay";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email."),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is at least 8 characters long."),
});

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require("../assets/authbackground.png")} style={styles.background}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, actions) => {
            // actions.resetForm();
            setLoading(true);
            const res = await signIn(values);
            console.log(res);
            setLoading(false);
            if (!res.success) {
              if (res.errors.email) {
                Alert.alert(
                  "Need help finding your account?",
                  `It looks like ${values.email} isn't connected to an account, if you believe this is wrong please contact us immediatly and we can help you log in to your account.`,
                  [
                    { text: "Try again" },

                    {
                      text: "Create an Account",
                      onPress: () => {
                        navigation.navigate("Register");
                      },
                    },
                  ],
                  {
                    cancelable: true,
                  }
                );
              } else {
                Alert.alert(
                  "Have you lost your password?",
                  `You are entering a wrong password, if you believe this is wrong please contact us immediatly and we can help you log in to your account`,
                  [
                    { text: "Try again", style: "positive" },
                    {
                      text: "Forgot password?",
                      onPress: () => {
                        // Navigate to forgot password
                        console.log("User forgot password");
                      },
                    },
                  ],
                  {
                    cancelable: true,
                  }
                );
              }
            }
          }}>
          {(props) => (
            <View style={styles.formContainer}>
              <Spinner visible={loading} />
              <View>
                <Image source={require("../assets/prototypelogo.png")} style={styles.logo} />
              </View>

              <View>
                <Text style={styles.title}>Phonography</Text>
              </View>

              <View style={styles.inputFieldsContainer}>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={{ ...styles.input, flex: 1, borderBottomWidth: 0 }}
                    placeholder="Email Address"
                    value={props.values.email}
                    onChangeText={props.handleChange("email")}
                    onBlur={props.handleBlur("email")}
                    keyboardType="email-address"
                  />
                </View>
                {props.touched.email && props.errors.email && (
                  <Text style={globalStyles.errorText}>{props.errors.email}</Text>
                )}

                <View style={styles.inputGroup}>
                  <TextInput
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={props.values.password}
                    onChangeText={props.handleChange("password")}
                    onBlur={props.handleBlur("password")}
                  />
                  {!showPassword && (
                    <Ionicons
                      name="eye-sharp"
                      size={22}
                      color="#aaa"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  )}
                  {showPassword && (
                    <Ionicons
                      name="eye-off-sharp"
                      size={22}
                      color="#000"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  )}
                </View>
                {props.touched.password && props.errors.password && (
                  <Text style={globalStyles.errorText}>{props.errors.password}</Text>
                )}

                <View style={styles.submitBtnContainer}>
                  <SolidButton text="Login" onPress={props.handleSubmit} borderRadius={30} />
                </View>

                <View style={styles.bottomContainer}>
                  <Text style={globalStyles.normalText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={globalStyles.textLink}>Create an account.</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ position: "absolute", bottom: "3%" }}>
                  <Text
                    style={{
                      ...globalStyles.normalText,
                      textDecorationLine: "underline",
                    }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 1.1,
    // width: "100%",
    // height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: "25%",
  },
  formContainer: {
    padding: 30,
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 36,
    fontFamily: "nunito-extraBold",
    color: "#462C6A",
    marginBottom: 30,
  },
  inputFieldsContainer: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    marginVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  input: {
    paddingBottom: 6,
    paddingTop: 10,
  },
  submitBtnContainer: {
    width: 150,
  },
  bottomContainer: {
    marginVertical: 20,
    position: "absolute",
    bottom: "10%",
  },
});

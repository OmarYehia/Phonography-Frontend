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
import CountryPicker from "react-native-country-picker-modal";
import Spinner from "react-native-loading-spinner-overlay";

const registerSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email."),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is at least 8 characters long."),
  passwordConfirmation: yup
    .string()
    .required("Enter your password again.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
  name: yup.string().required("Please enter your name").trim(),
  country: yup.string().required("Please select a country."),
  phone_number: yup.string().required("Please enter your phone number."),
});

export default function RegisterScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useContext(AuthContext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require("../assets/authbackground.png")} style={styles.background}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirmation: "",
            name: "",
            phone_number: "",
            country: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, actions) => {
            if (!values.country) {
              actions.setErrors({ country: "Pleae pick a country" });
              return;
            }
            setLoading(true);
            const res = await signUp(values);
            setLoading(false);
            if (!res.success) {
              let message = "";
              if (res.errors.name) {
                message += `
${res.errors.name}
`;
              }
              if (res.errors.email) {
                message += `
${res.errors.email}
`;
              }
              if (res.errors.password) {
                message += `
${res.errors.password}
`;
              }
              if (res.errors.phone_number) {
                message += `
${res.errors.phone_number}
`;
              }
              if (res.errors.country) {
                message += `
${res.errors.country}
`;
              }

              Alert.alert("These errors occured while trying to create the account:", message, [
                { text: "Try again" },
              ]);
            }
          }}>
          {(props) => (
            <View style={styles.formContainer}>
              <Spinner visible={loading} />

              <View>
                <Image source={require("../assets/prototypelogo.png")} style={styles.logo} />
              </View>

              {/* <View>
                <Text style={styles.title}>Phonography</Text>
              </View> */}

              <View style={styles.inputFieldsContainer}>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Full Name"
                    value={props.values.name}
                    onChangeText={props.handleChange("name")}
                    onBlur={props.handleBlur("name")}
                  />
                </View>
                {props.touched.name && props.errors.name && (
                  <Text style={globalStyles.errorText}>{props.errors.name}</Text>
                )}

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

                <View style={styles.inputGroup}>
                  <TextInput
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Confirm Password"
                    secureTextEntry={!showPassword}
                    value={props.values.passwordConfirmation}
                    onChangeText={props.handleChange("passwordConfirmation")}
                    onBlur={props.handleBlur("passwordConfirmation")}
                  />
                </View>
                {props.touched.passwordConfirmation && props.errors.passwordConfirmation && (
                  <Text style={globalStyles.errorText}>{props.errors.passwordConfirmation}</Text>
                )}

                <View style={styles.inputGroup}>
                  <TextInput
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Phone Number"
                    value={props.values.phone_number}
                    onChangeText={props.handleChange("phone_number")}
                    onBlur={props.handleBlur("phone_number")}
                    keyboardType="number-pad"
                  />
                </View>
                {props.touched.phone_number && props.errors.phone_number && (
                  <Text style={globalStyles.errorText}>{props.errors.phone_number}</Text>
                )}

                <View style={{ flexDirection: "row" }}>
                  <View style={styles.pickerGroup}>
                    <View style={styles.picker}>
                      <CountryPicker
                        onSelect={(country) => {
                          props.values.country = country.name;
                          setCountry(country.name);
                        }}
                        withFlag
                        withCountryNameButton
                        withAlphaFilter
                        theme={{ ...globalStyles.normalText }}
                      />
                    </View>
                    {!!country && <Text style={{ ...globalStyles.normalText }}>{country}</Text>}
                    {props.touched.country && props.errors.country && (
                      <Text style={globalStyles.errorText}>{props.errors.country}</Text>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    ...styles.submitBtnContainer,
                  }}>
                  <SolidButton text="Register" onPress={props.handleSubmit} borderRadius={30} />
                </View>

                <View style={styles.bottomContainer}>
                  <Text style={globalStyles.normalText}>Already a member?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{ ...globalStyles.textLink, marginHorizontal: 5 }}>
                      Login now.
                    </Text>
                  </TouchableOpacity>
                </View>
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
    width: 100,
    height: 100,
    marginTop: "3%",
  },
  formContainer: {
    padding: 30,
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 30,
    fontFamily: "nunito-extraBold",
    color: "#462C6A",
    marginBottom: 10,
  },
  inputFieldsContainer: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    marginVertical: 6,
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
    width: 120,
  },
  bottomContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    // position: "absolute",
    // bottom: "1%",
  },
  pickerGroup: {
    justifyContent: "center",
    marginVertical: 10,
    alignItems: "center",
  },
  picker: {
    flexDirection: "row",
    backgroundColor: "#AFBBE3",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 13,
    marginVertical: 10,
    elevation: 2,
    width: 130,
    alignItems: "center",
    justifyContent: "center",
  },
});

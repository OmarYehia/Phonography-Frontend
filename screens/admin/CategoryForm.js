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
import SolidButton from "../../components/shared/SolidButton";
import { globalStyles } from "../../styles/global";
import { Formik } from "formik";
import * as yup from "yup";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../../@env";
import { showMessage } from "react-native-flash-message";

const categorySchema = yup.object({
  name: yup
    .string()
    .required("Please enter category name.")
    .min(2, "Category name should be at least 2 characters."),
});

export default function CategoryForm({ navigation, route }) {
  const { userToken, categoryId } = route.params;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let res = result.uri.replace("file://", "").split("/");
      let name = res[res.length - 1];
      let extension = name.split(".")[1];
      setImage({ uri: result.uri, name: name, type: `image/${extension}` });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={categorySchema}
        onSubmit={async (values, actions) => {
          if (!image) {
            actions.setErrors({ image: "Please select an image." });
          }

          let fd = new FormData();
          fd.append("name", values.name);
          fd.append("categoryImage", image);

          setLoading(true);

          let jsonRes;
          if (createForm) {
            const res = await fetch(`${API_URL}/categories`, {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
              },
              body: fd,
            });

            jsonRes = await res.json();

            if (jsonRes.success) {
              showMessage({
                message: "Category created succesfully!",
                type: "success",
                duration: 2500,
                icon: "auto",
              });
            } else {
              showMessage({
                message: "Category wasn't created. Something went wrong.",
                type: "danger",
                duration: 2500,
                icon: "auto",
              });
            }
          } else {
            const res = await fetch(`${API_URL}/categories/${categoryId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
              },
              body: fd,
            });

            jsonRes = await res.json();
          }
          setLoading(false);
          if (!jsonRes.success) {
            let message = "";
            if (jsonRes.errors.name) {
              message += `
${jsonRes.errors.name}
`;
            }
            if (jsonRes.errors.image) {
              message += `
${jsonRes.errors.image}
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

            <View style={styles.inputFieldsContainer}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="Category Name"
                  value={props.values.name}
                  onChangeText={props.handleChange("name")}
                  onBlur={props.handleBlur("name")}
                />
              </View>
              {props.touched.name && props.errors.name && (
                <Text style={globalStyles.errorText}>{props.errors.name}</Text>
              )}

              {image && (
                <View>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                </View>
              )}
              <View>
                <SolidButton text="Select image" onPress={pickImage} />
              </View>
              {!image && props.errors.image && (
                <Text style={globalStyles.errorText}>{props.errors.image}</Text>
              )}
            </View>

            <View
              style={{
                ...styles.submitBtnContainer,
              }}>
              <SolidButton text="Create Category" onPress={props.handleSubmit} borderRadius={30} />
            </View>
          </View>
        )}
      </Formik>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 30,
    flex: 1,
    alignItems: "center",
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
    width: 200,
  },
  previewImage: {
    height: 200,
    width: Dimensions.get("window").width * 0.9,
    marginTop: 30,
    borderRadius: 8,
  },
});

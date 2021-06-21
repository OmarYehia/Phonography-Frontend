import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { globalStyles } from "../styles/global";
import { Entypo } from "@expo/vector-icons";
import SolidButton from "../components/shared/SolidButton";
import { API_URL } from "../@env";
import Spinner from "react-native-loading-spinner-overlay";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { FlatList } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
import { showMessage } from "react-native-flash-message";

const registerSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email."),
  name: yup.string().required("Please enter your name").trim(),
  phone_number: yup.string().required("Please enter your phone number"),
});

export default function UserProfile({ route, navigation }) {
  const { signOut } = useContext(AuthContext);
  const { userId, token } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editIsLoading, setEditIsLoading] = useState(true);
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // Fetching the required user

    const decodedToken = jwt_decode(token);
    const currentUserId = decodedToken.userId;
    setCurrentUser(currentUserId);

    if (currentUserId === userId) {
      setIsProfileOwner(true);
    }

    (async () => {
      try {
        const userRes = await fetch(`${API_URL}/users/${userId}`);
        const userJsonRes = await userRes.json();

        if (!userJsonRes.success) {
          throw Error("Not found");
        } else {
          setUser(userJsonRes.data.user);
        }

        const postsRes = await fetch(`${API_URL}/posts/user/${userId}`);
        const postsJsonRes = await postsRes.json();
        setPosts(postsJsonRes.data.post);

        const allPosts = postsJsonRes.data.post;
        let likes = 0;

        if (allPosts.length > 0) {
          allPosts.map((post) => {
            likes += post.likes.length;
          });
        }
        setLikesCount(likes);
      } catch (error) {
        console.log(error);
        if (error.message == "Not found") {
          Alert.alert(
            "Oops! User not found",
            "We currently don't have any information about this user. Maybe this account is deleted and no longer exists. You will now be redirected to homepage.",
            [{ text: "I Understand", onPress: () => navigation.navigate("Home") }]
          );
        } else {
          Alert.alert(
            "Oops! Couldn't connect to our servers",
            "We're having some troubles talking to our servers. Please try again later."
          );
          signOut();
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleAddImage = (currentUserId) => {
    Alert.alert(
      "We're sorry!",
      "This feature to upload your own avatar is not currently available. We're working on it and will be published in a future release. Thank you for understanding"
    );
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        marginTop: 40,
        paddingRight: 0,
        paddingLeft: 0,
      }}>
      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : (
        user && (
          <ScrollView>
            <Modal visible={showInfoModal} animationType="slide" transparent>
              <View
                style={{
                  backgroundColor: "#00000088",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Formik
                  initialValues={{
                    email: user.email,
                    name: user.name,
                    phone_number: user.phone_number,
                  }}
                  validationSchema={registerSchema}
                  onSubmit={async (values, actions) => {
                    setEditIsLoading(true);
                    const fetchRes = await fetch(`${API_URL}/users/${currentUser}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ ...values, country: user.country }),
                    });

                    const res = await fetchRes.json();
                    setEditIsLoading(false);

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
                      Alert.alert(
                        "These errors occured while trying to create the account:",
                        message,
                        [{ text: "Try again" }]
                      );
                    } else {
                      setUser(res.data.user);
                      setShowInfoModal(false);
                      showMessage({
                        message: "Profile updated succesfully!",
                        type: "success",
                        duration: 2500,
                        icon: "auto",
                      });
                    }
                  }}>
                  {(props) => (
                    <View style={styles.formContainer}>
                      <Spinner visible={editIsLoading} />

                      <View style={styles.inputFieldsContainer}>
                        <Text style={{ ...globalStyles.titleText, ...styles.labels, marginTop: 2 }}>
                          Name
                        </Text>
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

                        <Text
                          style={{
                            ...globalStyles.titleText,
                            ...styles.labels,
                          }}>
                          Email Address
                        </Text>
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

                        <Text style={{ ...globalStyles.titleText, ...styles.labels }}>
                          Phone Number
                        </Text>
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

                        <View
                          style={{
                            ...styles.submitBtnContainer,
                          }}>
                          <SolidButton text="Save" onPress={props.handleSubmit} borderRadius={30} />
                        </View>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </Modal>

            <View style={styles.body}>
              {isProfileOwner && (
                <TouchableOpacity onPress={() => handleAddImage(currentUser)}>
                  <View style={styles.imageContainer}>
                    <Image source={require("../assets/default-avatar.jpg")} style={styles.avatar} />
                    <View style={styles.imageAdd}>
                      <Entypo name="camera" size={34} color="#eee" />
                    </View>
                  </View>
                </TouchableOpacity>
              )}

              {
                !isProfileOwner && (
                  // <TouchableOpacity>
                  <View style={styles.imageContainer}>
                    <Image source={require("../assets/default-avatar.jpg")} style={styles.avatar} />
                    {/* <View style={styles.imageAdd}>
                  <Entypo name="camera" size={34} color="#eee" />
                </View> */}
                  </View>
                )
                // </TouchableOpacity>
              }

              <Text style={{ ...globalStyles.titleText, ...styles.name }}>{user.name}</Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={{ ...styles.statsRow }}>
                  <View
                    style={{
                      ...styles.statsRowCol,
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "60%",
                        textAlign: "center",
                      }}>
                      Posts
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "40%",
                      }}>
                      {posts && posts.length}
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.statsRowCol,
                      flexDirection: "row-reverse",
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "60%",
                        textAlign: "center",
                      }}>
                      Likes
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "40%",
                      }}>
                      {likesCount}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View
                    style={{
                      ...styles.statsRowCol,
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "60%",
                        textAlign: "center",
                      }}>
                      Followers
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "40%",
                      }}>
                      {user.followers.length}
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.statsRowCol,
                      flexDirection: "row-reverse",
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "60%",
                        textAlign: "center",
                      }}>
                      Following
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "40%",
                      }}>
                      {user.following.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View
                    style={{
                      ...styles.statsRowCol,
                      width: "100%",
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "30%",
                        textAlign: "center",
                      }}>
                      Email
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "70%",
                      }}>
                      {user.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View
                    style={{
                      ...styles.statsRowCol,
                      width: "100%",
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "30%",
                        textAlign: "center",
                      }}>
                      Phone
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "70%",
                      }}>
                      {" "}
                      {user.phone_number}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View
                    style={{
                      ...styles.statsRowCol,
                      width: "100%",
                    }}>
                    <Text
                      style={{
                        ...globalStyles.titleText,
                        backgroundColor: "#DCDCDC",
                        paddingVertical: 10,
                        width: "30%",
                        textAlign: "center",
                      }}>
                      Country
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.normalText,
                        paddingVertical: 10,
                        textAlign: "center",
                        width: "70%",
                      }}>
                      {user.country}
                    </Text>
                  </View>
                </View>
              </View>

              {isProfileOwner && (
                <View style={styles.editBtnContainer}>
                  <SolidButton
                    text="Edit Profile"
                    borderRadius={5}
                    onPress={() => setShowInfoModal(true)}
                  />
                </View>
              )}

              <View style={styles.postsContainer}>
                <Text style={{ ...globalStyles.titleText, ...styles.postsTitle }}>Posts</Text>
                <ScrollView horizontal>
                  {posts && (
                    <FlatList
                      keyExtractor={(item) => item._id}
                      data={posts}
                      numColumns={2}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity>
                            <View style={styles.postCard}>
                              <Image
                                source={{
                                  // uri: "https://assets.unenvironment.org/s3fs-public/styles/topics_content_promo/public/2021-05/alberta-2297204_1920.jpg?itok=aim5GFuY",
                                  uri: item.image,
                                }}
                                style={styles.postImage}
                              />
                              <Text style={{ ...globalStyles.titleText, padding: 10 }}>
                                Likes: {item.likes.length}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  )}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
}

const avatarSide = Dimensions.get("window").width * 0.65;
const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
  },
  imageContainer: {
    position: "relative",
    elevation: 3,
  },
  avatar: {
    height: avatarSide,
    width: avatarSide,
    alignSelf: "center",
    borderRadius: avatarSide,
  },
  imageAdd: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f01d71",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    elevation: 7,
  },
  name: {
    fontSize: 38,
    textAlign: "center",
    paddingHorizontal: 30,
    marginVertical: 18,
  },
  statsContainer: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 4,
    width: Dimensions.get("window").width * 0.9,
    marginVertical: 12,
    elevation: 5,
    backgroundColor: "#F7F7F7",
  },
  statsRowCol: {
    flexDirection: "row",
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#CCC",
    borderStyle: "dashed",
  },
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#777",
  },
  editBtnContainer: {
    width: Dimensions.get("window").width * 0.9,
  },
  postsContainer: {
    marginVertical: 25,
    padding: 10,
    borderColor: "#444",
    borderWidth: 1,
    width: Dimensions.get("window").width * 0.9,
    borderRadius: 4,
    position: "relative",
    alignItems: "center",
  },
  postsTitle: {
    position: "absolute",
    top: -15,
    left: 15,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 10,
  },
  postCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  postImage: {
    height: Dimensions.get("window").width * 0.38,
    width: Dimensions.get("window").width * 0.38,
  },

  formContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height * 0.6,
    // marginVertical: "40%",
    borderRadius: 5,
    backgroundColor: "white",
    marginHorizontal: 15,
  },
  inputFieldsContainer: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    // marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "white",
  },
  input: {
    paddingBottom: 6,
    paddingTop: 6,
    paddingHorizontal: 10,
  },
  submitBtnContainer: {
    width: 120,
  },
  labels: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 0,
  },
});

import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../../components/shared/Header";
import Spinner from "react-native-loading-spinner-overlay";
import { API_URL } from "../../@env";
import { globalStyles } from "../../styles/global";

const Stack = createStackNavigator();

const Field = ({ label, value }) => (
  <View style={styles.statsRow}>
    <View
      style={{
        ...styles.statsRowCol,
        width: "100%",
      }}>
      <Text
        style={{
          ...globalStyles.titleText,
          ...styles.leftLabel,
        }}>
        {label}
      </Text>
      <Text
        style={{
          ...globalStyles.normalText,
          ...styles.rightCol,
        }}>
        {value}
      </Text>
    </View>
  </View>
);

const Stats = ({ route }) => {
  const { changeLoadingState } = route.params;
  const [usersCount, setUsersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [competitionsCount, setCompetitionsCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      let res = await fetch(`${API_URL}/users`);
      const userJsonRes = await res.json();
      if (userJsonRes.success) {
        setUsersCount(userJsonRes.numberOfRecords);
      }

      res = await fetch(`${API_URL}/competition`);
      const competitionJsonRes = await res.json();
      if (competitionJsonRes.success) {
        setCompetitionsCount(competitionJsonRes.numberOfRecords);
      }

      res = await fetch(`${API_URL}/posts`);
      const postsJsonRes = await res.json();
      if (postsJsonRes.success) {
        setPostsCount(postsJsonRes.numberOfRecords);
        let likes = 0;
        let comments = 0;

        const allPosts = postsJsonRes.data.post;
        if (postsJsonRes.numberOfRecords > 0) {
          allPosts.map((post) => {
            likes += post.likes.length;
            comments += post.comments.length;
          });
        }

        setLikesCount(likes);
        setCommentsCount(comments);
      }
      changeLoadingState(false);
    };
    getData();
  }, []);

  return (
    <View style={{ ...globalStyles.container, ...styles.body }}>
      <View style={styles.statsContainer}>
        <Field label="Total number of users" value={usersCount} />
        <Field label="Total number of posts" value={postsCount} />
        <Field label="Total number of likes" value={likesCount} />
        <Field label="Total number of comments" value={commentsCount} />
        <Field label="Total number of competitions" value={competitionsCount} />
      </View>

      <Text style={{ ...globalStyles.titleText, marginTop: 50 }}>Coming soon...</Text>
      <Text style={{ ...globalStyles.normalText }}>Charts and Visual Stats</Text>
    </View>
  );
};

export default function Main() {
  const [loading, setLoading] = useState(true);
  const changeLoadingState = (state) => {
    setLoading(state);
  };
  return (
    <>
      <Spinner visible={loading} />
      <Stack.Navigator>
        <Stack.Screen
          name="Stats"
          component={Stats}
          options={({ navigation }) => {
            return {
              headerTitle: () => <Header navigation={navigation} title="Application Stats" />,
            };
          }}
          initialParams={{ changeLoadingState }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    justifyContent: "center",
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
  leftLabel: {
    backgroundColor: "#DCDCDC",
    paddingVertical: 10,
    width: "70%",
    textAlign: "center",
  },
  rightCol: {
    paddingVertical: 10,
    textAlign: "center",
    width: "30%",
  },
});

import React, { useState, useEffect } from "react";
import CategoryList from "../../components/Category/CategoryList";
import { globalStyles } from "../../styles/global";
import {
  FlatList,
  Alert,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../../@env";
import Spinner from "react-native-loading-spinner-overlay";
import Card from "../../components/shared/card";
import { MaterialIcons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

export default function CategoriesList({ route, navigation }) {
  const { userToken } = route.params;
  const [categories, setCategories] = useState(null);
  const [noCategories, setNoCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => {
        if (res.status === 500) {
          Alert.alert(
            "Oops!",
            "Something went wrong in our servers. Please hold on and try again later."
          );
          setNoCategories(true);
        }
        return res.json();
      })
      .then((data) => {
        if (data.numberOfRecords <= 0) {
          setNoCategories(true);
        } else {
          setCategories(data.data.categories);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          "Oops!",
          "Something went wrong in our servers. Please hold on and try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [changed]);

  const deleteHandler = (item) => {
    Alert.alert("Warning", `Are you sure you want to delete ${item.name} competition?`, [
      {
        text: "yes",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/categories/${item._id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              method: "DELETE",
            });

            const jsonRes = await res.json();
            if (jsonRes.success) {
              setChanged(!changed);
              showMessage({
                message: "Category deleted succesfully!",
                type: "success",
                duration: 2500,
                icon: "auto",
              });
            } else {
              showMessage({
                message: "Couldn't delete Category, something went wrong. Try again later.",
                type: "danger",
                duration: 2500,
                icon: "auto",
              });
            }
          } catch (error) {
            console.log(error);
            return error;
          }
        },
      },
      { text: "No" },
    ]);
  };

  const editHandler = (item) => {
    navigation.navigate("Create Category", {
      editId: item._id,
      editName: item.name,
      editImage: item.image,
      setChanged,
      changed,
    });
  };

  return (
    <View style={{ ...globalStyles.container, ...styles.container }}>
      <>
        {categories && (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Spinner visible={loading} />
            <FlatList
              data={categories}
              numColumns={1}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cardContainer} onPress={() => editHandler(item)}>
                  <Card>
                    <View style={styles.itemContent}>
                      <Text style={globalStyles.titleText}>{item.name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons
                          name="delete"
                          size={30}
                          color="red"
                          onPress={() => deleteHandler(item)}
                        />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {noCategories && (
          <Text style={globalStyles.normalText}>No categories are available at this moment.</Text>
        )}
      </>
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
    // paddingHorizontal: 5,
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 7,
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.8,
    marginHorizontal: 6,
    marginBottom: 20,
  },

  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

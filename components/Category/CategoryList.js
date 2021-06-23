import React, { useState, useEffect } from "react";
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
import { globalStyles } from "../../styles/global";

export default function CategoryList() {
  const [categories, setCategories] = useState(null);
  const [noCategories, setNoCategories] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <>
      {categories && (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Spinner visible={loading} />
          <FlatList
            data={categories}
            numColumns={2}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cardContainer}>
                <View style={{ height: 180 }}>
                  <Image
                    source={{
                      // uri: "data:image/jpeg;base64,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",
                      uri: item.image,
                    }}
                    style={styles.image}
                  />
                </View>
                <Text
                  style={{
                    ...globalStyles.titleText,
                    // textAlign: "center",
                    marginTop: 5,
                    marginStart: 8,
                    marginBottom: 5,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {noCategories && (
        <Text style={globalStyles.normalText}>No categories are available at this moment.</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 7,
  },
  cardContainer: {
    width: ((Dimensions.get("window").width - 24) * 0.95) / 2,
    marginHorizontal: 6,
    marginBottom: 20,
  },
});

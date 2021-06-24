import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { globalStyles } from "../../styles/global";
import Card from "../../components/shared/card";
import { API_URL } from "../../@env";
import { MaterialIcons } from "@expo/vector-icons";
import CompetitionForm from "./CompetitionForm";
import jwt_decode from "jwt-decode";
import { showMessage } from "react-native-flash-message";


export default function Competition({ route, navigation }) {
  const [competitions, setCompetitions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [competition, setCompetition] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const userToken = route.params.userToken;

  const pressHandler = (item) => {
    navigation.navigate("ContestDetails", item);
  };
  const deleteHandler = (item) => {
    Alert.alert("Warning", `Are you sure you want to delete ${item.name} competition?`, [
      {
        text: "yes",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/competition/${item._id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              method: "DELETE",
            });

            const jsonRes = await res.json();
            setChanged(!changed);
            if (jsonRes.Success) {
              showMessage({
                message: `Contest deleted succesfully!`,
                type: "success",
                duration: 2500,
                icon: "auto",
              });
            } else {
              showMessage({
                message: `Contest wasn't deleted. Something went wrong.`,
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
    setFlag(true);
    setCompetition(item);
    setModalOpen(true);
    setChanged(!changed);
  };

  useEffect(() => {
    const decodedToken = jwt_decode(userToken);
    const currentUser = decodedToken.role;
    setCurrentUserRole(currentUser);

    // get all competitions
    fetch(`${API_URL}/competition`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 404) {
            throw Error("Notfound");
          }
        }
      })
      .then((data) => {
        setCompetitions(data.data.competitions);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changed]);

  return (
    <View style={globalStyles.container}>
      <Modal visible={modalOpen} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => {
                setModalOpen(false);
                setFlag(false);
                setCompetition(null);
                setChanged(!changed);
              }}
            />
            <CompetitionForm
              userToken={route.params.userToken}
              flag={flag}
              competition={competition}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {currentUserRole === "admin" ? (
        <MaterialIcons
          name="add"
          size={24}
          style={styles.modalToggle}
          onPress={() => setModalOpen(true)}
        />
      ) : null}
      <FlatList
        data={competitions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => pressHandler(item)}>
            <Card>
              <View style={styles.itemContent}>
                <Text style={globalStyles.titleText}>{item.name}</Text>
                {currentUserRole === "admin" ? (
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons
                      name="edit"
                      size={30}
                      color="black"
                      onPress={() => editHandler(item)}
                    />
                    <MaterialIcons
                      name="delete"
                      size={30}
                      color="red"
                      onPress={() => deleteHandler(item)}
                    />
                  </View>
                ) : null}
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

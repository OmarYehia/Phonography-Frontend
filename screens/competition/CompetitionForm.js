import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Button, TextInput, View, Text, Alert } from "react-native";
import { globalStyles } from "../../styles/global";
import { Formik } from "formik";
import * as yup from "yup";
import SolidButton from "../../components/shared/SolidButton";
import { API_URL } from "../../@env";
import { AuthContext } from "../../context/AuthContext";
//import DatePicker from 'react-native-date-picker';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-native-datepicker";
//import { Dropdown } from 'react-native-material-dropdown-v2';
import { Picker } from "@react-native-picker/picker";
import { LogBox } from "react-native";
import { showMessage } from "react-native-flash-message";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const competitionSchema = yup.object({
  name: yup.string().required("Please Enter Competition Name ").min(4),
  startDate: yup.date().required("Please Enter Competition Start Date "),
  endDate: yup
    .date()
    .required("Please Enter Competition End Date ")
    .min(yup.ref("startDate"), "end date can't be before start date"),
  sponsor: yup.string().required("Please choose a sponsor for the competition"),
  prizes: yup.string().required(),
});

export default function CompetitionForm({ userToken, flag, competition }) {
  const [sponsor, setSponsor] = useState(flag? competition.sponsor._id :null);
  const [sponsors, setSponsors] = useState([]);
  const [itemData, setItemData] = useState(
    flag
      ? {
          name: competition.name,
          startDate: competition.startDate,
          endDate: competition.endDate,
          sponsor: competition.sponsor._id,
          prizes: competition.prizes,
        }
      : {
          name: "",
          startDate: "",
          endDate: "",
          sponsor: "",
          prizes: "",
        }
  );

  useEffect(() => {
    fetch(`${API_URL}/users`)
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
        setSponsors(data.data.users);
      })
      .catch((err) => {
        console.log("errooor", err);
      });
  }, []);

  const addCompetition = async (data) => {
    try {
      const res = await fetch(`${API_URL}/competition`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      const jsonRes = await res.json();
     
      
      return jsonRes;
    } catch (error) {
      return error;
    }
  };
  const editCompetition = async (data) => {
    try {
      console.log(data);
      const res = await fetch(`${API_URL}/competition/${competition._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        method: "PUT",
        body: JSON.stringify(data),
      });

      const jsonRes = await res.json();
      
      return jsonRes;
    } catch (error) {
      return error;
    }
  };

  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={itemData}
        validationSchema={competitionSchema}
        onSubmit={async (values, actions) => {
          let res;
          if (!flag) {
            actions.resetForm();
            setSponsor(null);
            res = await addCompetition(values);
          } else if (flag) {
            res = await editCompetition(values);
          }
          if (res.Success) {
            showMessage({
              message: `Contest ${flag ? "updated" : "created"} succesfully!`,
              type: "success",
              duration: 2500,
              icon: "auto",
            });
          } else {
            showMessage({
              message: `Contest wasn't ${flag ? "updated" : "created"}. Something went wrong.`,
              type: "danger",
              duration: 2500,
              icon: "auto",
            });
            let message = "";
            if (res.errors.name) {
              message += `${res.errors.name}`;
            }
            if (res.errors.startDate) {
              message += `${res.errors.startDate}`;
            }
            if (res.errors.endDate) {
              message += `${res.errors.endDate}`;
            }
            if (res.errors.sponsor) {
              message += `${res.errors.sponsor}`;
            }
            if (res.errors.prizes) {
              message += `${res.errors.prizes}`;
            }
            else{
              message += `${res.errors.message}`
            }
            Alert.alert(`These errors occured while trying to ${flag ? "Edit" : "create"}  the competition:`, message, [
              { text: "Try again" },
            ]);
          }
        }}>
        {(props) => (
          <View>
            <TextInput
              style={globalStyles.input}
              placeholder="Competition Name"
              onChangeText={props.handleChange("name")}
              value={props.values.name}
              onBlur={props.handleBlur("name")}
            />
            <Text style={globalStyles.errorText}>{props.touched.name && props.errors.name}</Text>
            <DatePicker
              style={{ width: 300 }}
              date={props.values.startDate}
              value={props.values.startDate}
              mode="date"
              placeholder="Select Start Date"
              format="YYYY-MM-DD"
              minDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={props.handleChange("startDate")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.startDate && props.errors.startDate}
            </Text>
            <DatePicker
              style={{ width: 300 }}
              date={props.values.endDate}
              value={props.values.endDate}
              mode="date"
              placeholder="Select End Date"
              format="YYYY-MM-DD"
              minDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={props.handleChange("endDate")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.endDate && props.errors.endDate}
            </Text>
            <Picker
              selectedValue={sponsor}
              style={{ height: 50, width: 200 }}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {
                props.setFieldValue("sponsor", itemValue);
                console.log(sponsor)
                setSponsor(itemValue);
              }}>
              <Picker.Item label="Select a sponsor" value={flag? sponsor :"#"} />
              {sponsors.length ? (
                sponsors.map((each) => {
                  return <Picker.Item key={each._id} label={each.name} value={each._id} />;
                })
              ) : (
                <Picker.Item label="" value="" />
              )}
            </Picker>
            <Text style={globalStyles.errorText}>
              {props.touched.sponsor && props.errors.sponsor}
            </Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Prizes"
              onChangeText={props.handleChange("prizes")}
              value={props.values.prizes}
              onBlur={props.handleBlur("prizes")}
            />
            <Text style={globalStyles.errorText}>
              {props.touched.prizes && props.errors.prizes}
            </Text>
            {!flag ? (
              <SolidButton text="Add Contest" onPress={props.handleSubmit} />
            ) : (
              <SolidButton text="Edit Contest" onPress={props.handleSubmit} />
            )}
          </View>
        )}
      </Formik>
    </View>
  );
}

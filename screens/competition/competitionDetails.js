import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../@env";
import SolidButton from '../../components/shared/SolidButton';


export default function CompetitionDetails({ route }) {
    const [message, setMessage] = useState(null);

    const userToken = route.params.userToken

    const joinHandler = async () => {
        try {
            const res = await fetch(`${API_URL}/competition/${route.params._id}/competitor/join`, {
              headers: { 
                  "Content-Type": "application/json" ,
                  "Authorization": `Bearer ${userToken}`
              },
              method: "PUT",
            });
           
            const jsonRes = await res.json();
            console.log(jsonRes);
            setMessage(jsonRes.data.message)
            return jsonRes;
  
          } catch (error) {
              console.log(error)
            return error;
          }
    }
    const disjoinHandler = async () => {
        try {
            const res = await fetch(`${API_URL}/competition/${route.params._id}/competitor/remove`, {
              headers: { 
                  "Content-Type": "application/json" ,
                  "Authorization": `Bearer ${userToken}`
              },
              method: "PUT",
            });
           
            const jsonRes = await res.json();
            console.log(jsonRes);
            return jsonRes;
  
          } catch (error) {
              console.log(error)
            return error;
          }
    }

    return (
        <View style={globalStyles}>
            <Text>{message}</Text>
            <Card>
                <Text style={{...globalStyles.titleText, ...styles.nameText}}>{route.params.name}</Text>
                <View style={styles.items}>
                   <Text style={globalStyles.normalText}>Sponsor: </Text>
                   <Text style={globalStyles.normalText}>{route.params.sponsor.name}</Text>
                </View>
                <View style={styles.items}>
                    <Text style={globalStyles.normalText}>Prizes: </Text>
                    <Text style={globalStyles.normalText}>{route.params.prizes}</Text>
                </View>
                <View style={{...styles.items,...styles.date}}>
                    <Text style={globalStyles.normalText}>From: {route.params.startDate}</Text>
                    <Text style={globalStyles.normalText}>To: {route.params.endDate}</Text>
                </View>
                <View style={styles.items}>
                     <SolidButton text="Join This Context" onPress={() => joinHandler()}/>
                </View>
                <View style={styles.items}>
                     <SolidButton text="Disjoin This Context" onPress={() => disjoinHandler()}/>
                </View>
                
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 20,
        alignSelf: 'center'
    },
    items:{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    date:{
        justifyContent:'space-around'
    }
})
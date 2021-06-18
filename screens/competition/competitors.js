import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../@env";
import SolidButton from '../../components/shared/SolidButton';
import jwt_decode from "jwt-decode";


export default function Competitor({ route}){
   const [competitors, setCompetitors] = useState(null);
   const [isFriend, setIsFriend] = useState();
   const [changed, setChanged] = useState(false);

   const userToken = route.params.userToken;
   

   const followHandler = async (id) => {
    try {
      const res = await fetch(`${API_URL}/friendships/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        method: "POST",
      });

      const jsonRes = await res.json();
      setIsFriend(true);
      setChanged(!changed);
      console.log(jsonRes);
      return jsonRes;
    } catch (error) {
      return error;
    }
  };
   const unfollowHandler = async (id) => {
    try {
        const res = await fetch(`${API_URL}/friendships/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          method: "DELETE",
        });

        const jsonRes = await res.json();
        setIsFriend(false);
        setChanged(!changed);
        console.log(jsonRes);
        return jsonRes;
      } catch (error) {
        console.log(error);
        return error;
      }
};
          

   useEffect(() => {
    fetch(`${API_URL}/competition/${route.params.competitionId}/competitors`)
    .then(res => {
        if(res.ok) {
            return res.json()
        } else {
            if (res.status === 404){
                throw Error("Notfound")
            }
        }
    })
    .then(data => {
        setCompetitors(data.data.competitors);
        data.data.competitors.forEach(competitor => {
            if(competitor.followers.includes(route.params.currentUserId)){
                setIsFriend(true)
                
            }else{
                setIsFriend(false)
            }
               
           });
    })  
    .catch(err => {
        console.log(err)
    })
}, [changed]);
       
       
  
    

    return(
        <View>
            <FlatList
               data={competitors}
               keyExtractor={(item) => item._id}
               renderItem={({ item }) => (
                <TouchableOpacity>
                    <Card >
                        <View style={styles.itemContent}>
                           <Text style={globalStyles.titleText}>{item.name}</Text>
                           {! (route.params.currentUserId === item._id) ?
                                <SolidButton 
                                    text={isFriend ? "UnFollow" : "Follow"}
                                    onPress={isFriend ? () => unfollowHandler(item._id) : () => followHandler(item._id)}
                                    borderRadius={5} />   
                           :null}
                           
                        </View>
                    
                    </Card>
                   
                </TouchableOpacity>
               )} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    
    itemContent: {
        flexDirection: 'row',
        justifyContent:"space-between",
    }
  })
  
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements'
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../@env";
import SolidButton from '../../components/shared/SolidButton';
import { FontAwesome5 } from '@expo/vector-icons';
import jwt_decode from "jwt-decode";


export default function Competitor({ route, navigation}){
   const [competitors, setCompetitors] = useState(null);
   const [isFriend, setIsFriend] = useState();
   const [changed, setChanged] = useState(false);
   const [winner, setWinner] = useState(route.params.winner ?route.params.winner._id: null )
   

   const userToken = route.params.userToken;
   console.log(route.params);

   const pressHandler = (userId) => {
       navigation.navigate("User Profile",{userId});
   }
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
      /*  data.data.competitors.forEach(competitor => {
            if(competitor.followers.includes(route.params.currentUserId)){
                setIsFriend(true) 
                   
            }else{
                setIsFriend(false)
               
            }
               
           });*/
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
                <TouchableOpacity onPress={() => pressHandler(item._id)}>
                    <Card >
                        <View style={styles.itemContent}>
                          <View style={{flexDirection: 'row'}}>
                           <Avatar rounded size="small" source={require("../../assets/default-avatar.jpg")}  />
                           <Text style={{...globalStyles.titleText,marginLeft:10}}>{item.name}</Text>
                           {winner === item._id ? 
                            <FontAwesome5 name="award" size={30} color="crimson" />: null
                          }
                          </View>
                        
                           { route.params.currentUserId !== item._id  ?
                             ( (item.followers.includes(route.params.currentUserId) ?
                               <SolidButton 
                               text="UnFollow" 
                               onPress={ () => unfollowHandler(item._id) }
                               borderRadius={5} />
                               :<SolidButton 
                               text= "Follow"
                               onPress={ () => followHandler(item._id)}
                               borderRadius={5} />)
                             ):null}
                           
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
        flex:1,
        flexDirection: 'row',
        justifyContent:"space-between",
        alignContent:"center"
    }
  })
  
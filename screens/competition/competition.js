import React, { useEffect, useState } from 'react';
import { StyleSheet,Text, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { API_URL } from "../../@env";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CompetitionForm from './CompetitionForm';




export default function Competition({ route, navigation }){
    const [competitions, setCompetitions] = useState(null);
    const [modalOpen, setModalOpen] =  useState(false);
    const [flag, setFlag] = useState(false);
    const [competition, setCompetition] = useState(null);

    const userToken = route.params.userToken

    const pressHandler = (item) => {
        navigation.navigate('ContestDetails', item);
    }
    const deleteHandler =  (item) => {
        Alert.alert("Warning", `Are you sure you want to delete ${item.name} competition?`,[
            {
                text:"yes", onPress:async () => {
                    
                    try {
                        const res = await fetch(`${API_URL}/competition/${item._id}`, {
                          headers: { 
                              "Content-Type": "application/json" ,
                              "Authorization": `Bearer ${userToken}`
                          },
                          method: "DELETE",
                        });
                       
                        const jsonRes = await res.json();
                        console.log(jsonRes);
                        return jsonRes;
              
                      } catch (error) {
                          console.log(error)
                        return error;
                      }
                }
            },
            {text: "No"}
        ])
       
    }
    const joinHandler = async (item) => {
        try {
            const res = await fetch(`${API_URL}/competition/${item._id}/competitor/join`, {
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
        
    const editHandler = (item) => {
      setFlag(true);
      setCompetition(item);
      setModalOpen(true);
  }                   
                    
            
       
    

    
    useEffect(()=>{
      //  console.log(route.params.userToken)
        fetch(`${API_URL}/competition`)
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
              setCompetitions(data.data.competitions)
              

          })
          .catch(err => {
              console.log(err)
          })
    }, [competitions])

    return(
        <View style={globalStyles.container}>

          <Modal visible={modalOpen} animationType='slide'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                    <MaterialIcons 
                      name='close'
                      size={24}
                      style={{...styles.modalToggle, ...styles.modalClose}}
                      onPress={() => {setModalOpen(false); setFlag(false); setCompetition(null)}}
                    />
                    <CompetitionForm userToken={route.params.userToken} flag={flag} competition={competition} />
                </View>
                
            </TouchableWithoutFeedback>
            </Modal>
        
            <MaterialIcons 
                name='add'
                size={24}
                style={styles.modalToggle}
                onPress={() => setModalOpen(true)}
            />
            <FlatList
               data={competitions}
               keyExtractor={(item) => item._id}
               renderItem={({ item }) => (
                <TouchableOpacity onPress={() => pressHandler(item)}>
                    <Card >
                        <View style={styles.itemContent}>
                           <Text style={globalStyles.titleText}>{item.name}</Text>
                            <View style={{flexDirection:'row'}}>
                           {/* <Ionicons name="ios-enter-outline" size={30} color="blue" onPress={() => joinHandler(item)}/> */}
                            <MaterialIcons name="edit" size={30} color="black" onPress={() => editHandler(item)} />
                           <MaterialIcons name="delete" size={30} color="red" onPress={() => deleteHandler(item)} />
                        </View>
                        
                        </View>
                    
                    </Card>
                   
                </TouchableOpacity>
               )} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    modalToggle: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#f2f2f2',
      padding: 10,
      borderRadius: 10,
      alignSelf: 'center'
    },
    modalClose: {
      marginTop: 20,
      marginBottom: 0,
    },
    modalContent: {
      flex: 1,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent:"space-between"
    }
  })
  

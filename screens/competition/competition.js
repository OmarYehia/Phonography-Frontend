import React, { useEffect, useState } from 'react';
import { StyleSheet,Text, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { API_URL } from "../../@env";
import { MaterialIcons } from '@expo/vector-icons';
import CompetitionForm from './CompetitionForm';



export default function Competition({ route, navigation }){
    const [competition, setCompetition] = useState(null);
    const [modalOpen, setModalOpen] =  useState(false);

    const pressHandler = (item) => {
        navigation.navigate('ContestDetails', item);
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
              setCompetition(data.data.competitions)
              

          })
          .catch(err => {
              console.log(err)
          })
    }, [])

    return(
        <View style={globalStyles.container}>

          <Modal visible={modalOpen} animationType='slide'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                    <MaterialIcons 
                      name='close'
                      size={24}
                      style={{...styles.modalToggle, ...styles.modalClose}}
                      onPress={() => setModalOpen(false)}
                    />
                    <CompetitionForm userToken={route.params.userToken} />
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
               data={competition}
               keyExtractor={(item) => item._id}
               renderItem={({ item }) => (
                <TouchableOpacity onPress={() => pressHandler(item)}>
                    <Card>
                    <Text style={globalStyles.titleText}>{item.name}</Text>
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
    }
  })
  

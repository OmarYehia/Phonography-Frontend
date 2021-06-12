import React, { useEffect, useState } from 'react';
import { StyleSheet,Text, View, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../shared/card';
export default function Competition(){
    const [competition, setCompetition] = useState(null);

    const pressHandler = (item) => {
        console.log(item)
    }
    
    useEffect(()=>{
        console.log("from useeffect")
        fetch(`https://phonography-backend-os41.herokuapp.com/competition`)
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

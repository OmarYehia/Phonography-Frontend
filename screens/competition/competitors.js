import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../@env";
import SolidButton from '../../components/shared/SolidButton';
import jwt_decode from "jwt-decode";


export default function Competitor({ route }){

    console.log(route.params)

    return(
        <View>
            <FlatList
               data={route.params}
               keyExtractor={(item) => item._id}
               renderItem={({ item }) => (
                <TouchableOpacity>
                    <Card >
                        <View style={styles.itemContent}>
                           <Text style={globalStyles.titleText}>{item.name}</Text>   
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
        justifyContent:"space-between"
    }
  })
  
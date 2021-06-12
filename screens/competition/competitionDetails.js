import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../shared/card';


export default function CompetitionDetails({ navigation }) {

    return (
        <View style={globalStyles}>
            <Card>
                <Text style={{...globalStyles.titleText, ...styles.nameText}}>{navigation.getParam('name')}</Text>
                <View style={styles.items}>
                   <Text>Sponsor: </Text>
                   <Text>{navigation.getParam('sponsor').name}</Text>
                </View>
                <View style={styles.items}>
                    <Text>Prizes: </Text>
                    <Text>{navigation.getParam('prizes')}</Text>
                </View>
                <View style={{...styles.items,...styles.date}}>
                    <Text>Starts at:{navigation.getParam('startDate')}</Text>
                    <Text>Ends at: {navigation.getParam('endDate')}</Text>
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
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../components/shared/card';


export default function CompetitionDetails({ route , navigation }) {

    return (
        <View style={globalStyles}>
            <Card>
                <Text style={{...globalStyles.titleText, ...styles.nameText}}>{route.params.name}</Text>
                <View style={styles.items}>
                   <Text>Sponsor: </Text>
                   <Text>{route.params.sponsor.name}</Text>
                </View>
                <View style={styles.items}>
                    <Text>Prizes: </Text>
                    <Text>{route.params.prizes}</Text>
                </View>
                <View style={{...styles.items,...styles.date}}>
                    <Text>Starts at:{route.params.startDate}</Text>
                    <Text>Ends at: {route.params.endDate}</Text>
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
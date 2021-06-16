import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Competition from '../screens/competition/competition';
import CompetitionDetails from '../screens/competition/competitionDetails';

const Stack = createStackNavigator();

export default function CompetitionStack({route}) {
 // console.log(route.params.userToken)
  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Contests" component={Competition} initialParams={route.params} />
      <Stack.Screen name="ContestDetails" component={CompetitionDetails } initialParams={route.params}/>
    </Stack.Navigator>
  );
}
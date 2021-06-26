import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Competition from '../screens/competition/competition';
import CompetitionDetails from '../screens/competition/competitionDetails';
import Competitors from '../screens/competition/competitors';
import UserProfile from "../screens/UserProfile";

const Stack = createStackNavigator();

export default function CompetitionStack({route}) {
  route.params.refresh = true;
  const state = route.params;
 // console.log(state);
  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Contests" component={Competition} initialParams={route.params} />
      <Stack.Screen name="ContestDetails" component={CompetitionDetails } initialParams={route.params}/>
      <Stack.Screen name="Competitors" component={Competitors } />
      <Stack.Screen
        name="User Profile"
        component={UserProfile}
        initialParams={{ token: state.userToken, userId: state.userId }}
      />
      
    </Stack.Navigator>
  );
}
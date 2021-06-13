import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Competition from '../screens/competition/competition';
import CompetitionDetails from '../screens/competition/competitionDetails';

const Stack = createStackNavigator();

export default function CompetitionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Contests" component={Competition} />
      <Stack.Screen name="ContestDetails" component={CompetitionDetails } />
    </Stack.Navigator>
  );
}
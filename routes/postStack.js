import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import AllPosts from '../components/Post/allPosts';
import UserProfile from "../screens/UserProfile";

const Stack = createStackNavigator();

export default function CompetitionStack({route}) {
  const state = route.params;
  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Home" component={AllPosts} initialParams={route.params} />
      <Stack.Screen name="UserProfile" component={UserProfile}/>
    </Stack.Navigator>
  );
}
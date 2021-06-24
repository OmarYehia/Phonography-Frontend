import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import PostForm from '../components/Post/addPostForm';

const Stack = createStackNavigator();

export default function CompetitionStack({route}) {
  const state = route.params;
  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Create Post" component={PostForm} initialParams={route.params} />
    </Stack.Navigator>
  );
}
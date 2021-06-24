import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import AllPosts from '../components/Post/allPosts';
import MobilePosts from '../components/Post/mobileShots';
import CategoryPosts from '../components/Post/categoryShots';
import UserProfile from "../screens/UserProfile";

const Stack = createStackNavigator();

export default function CompetitionStack({route}) {
  route.params.refresh = true;
  const state = route.params;

  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Home" component={AllPosts} initialParams={route.params} />
      <Stack.Screen name="UserProfile" component={UserProfile}/>
      <Stack.Screen name="Mobile Photos" component={MobilePosts} initialParams={route.params}/>
      <Stack.Screen name="Category Photos" component={CategoryPosts} initialParams={route.params}/>
    </Stack.Navigator>
  );
}
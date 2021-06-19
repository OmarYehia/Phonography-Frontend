import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CompetitionStack from "../routes/competitionStack";
import PostStack from "../routes/postStack";
import PostForm from "../components/Post/addPostForm";
import Home from "../screens/Home";
import UserProfile from "../screens/UserProfile";
import React from "react";
import CategoriesScreen from "../screens/CategoriesScreen";

const Tab = createBottomTabNavigator();

export default function MainNavigator({ route }) {
  const state = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "User Profile") {
            iconName = focused ? "user-circle" : "user-circle-o";
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === "Categories") {
            return <MaterialIcons name="category" size={size} color={color} />;
          }else if (route.name === "Competitions") {
            iconName = focused ? "trophy-variant" : "trophy-variant-outline"
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "#f01d71",
        inactiveTintColor: "gray",
      }}>
      <Tab.Screen name="Home" component={PostStack} initialParams={state} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Competitions" component={CompetitionStack} initialParams={state}/>
      <Tab.Screen
        name="User Profile"
        component={UserProfile}
        initialParams={{ token: state.userToken, userId: state.userId }}
      />
      {/* <Stack.Screen name="Home" component={Home} initialParams={state} /> */}
      {/* <Stack.Screen name="Home" component={CompetitionStack} />
      <Stack.Screen name="Home" component={Home} initialParams={state} /> */}
    </Tab.Navigator>
  );
}
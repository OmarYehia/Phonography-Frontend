import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CategoryController from "../screens/admin/Category";
import Main from "../screens/admin/Main";

const Drawer = createDrawerNavigator();

export default function AdminDrawer({ route }) {
  const state = route.params;
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Category" component={CategoryController} initialParams={state} />
    </Drawer.Navigator>
  );
}

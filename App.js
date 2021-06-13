import "react-native-gesture-handler";
import React, { useReducer, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import jwt_decode from "jwt-decode";
import { AuthContextProvider } from "./context/AuthContext";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
  // This function to load fonts into the application
  const [isFontsLoaded] = useFonts({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "nunito-black": require("./assets/fonts/Nunito-Black.ttf"),
    "nunito-extraBold": require("./assets/fonts/Nunito-ExtraBold.ttf"),
  });

  /* useReducer is similiar to useState, it takes two arguments(reducer, initialState), it changes the
     state depending on the input type given to the dispatch() function.
     e.g.
     dispatch({ type: 'RESTORE_TOKEN', token: userToken }), this will fire the first case in the switch statement below,
     taking all the previous state and then changing the userToken to the token that was given to it, and sets the loading
     state to false.  
  */
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const validateTokenExpiration = (token) => {
    if (!token) return false;

    const decodedToken = jwt_decode(token);
    const currentDate = new Date();

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      // Token expired
      return false;
    }

    // Token is not expired
    return true;
  };

  // Checking if the user is authenticated or not when he first loads the application
  useEffect(() => {
    // Fetch the token from  storage
    const bootstrapAsync = async () => {
      let userToken;
      // await SecureStore.setItemAsync("userToken", "");

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (error) {
        console.log(error);
      }

      if (!validateTokenExpiration(userToken)) {
        dispatch({ type: "SIGN_OUT" });
        return;
      }

      // This dispatch will switch to app screen or auth screen and removes loading screen if any
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  // If the fonts aren't loaded yet, return nothing to negate errors
  if (!isFontsLoaded) {
    return null;
  }

  return (
    <AuthContextProvider dispatch={dispatch}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {state.userToken == null ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="Home" component={Home} initialParams={state} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}

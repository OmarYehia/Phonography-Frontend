import React, { createContext, useMemo } from "react";
import { API_URL } from "../@env";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

function AuthContextProvider(props) {
  /* useMemo() is a hook like a cache, it has some dependencies, whenever we call
     this function it checks if the dependencies haven't changed then it returns
     the same thing that it lastly returned, else it computes the function again with
     the new dependencies
  */
  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        try {
          const res = await fetch(`${API_URL}/login`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(data),
          });

          const jsonRes = await res.json();

          if (jsonRes.success) {
            // Saving the token in SecureStore
            await SecureStore.setItemAsync("userToken", jsonRes.data.token);
            props.dispatch({ type: "SIGN_IN", token: jsonRes.data.token });
          }

          return jsonRes;
        } catch (error) {
          return error;
        }
      },
      signOut: () => props.dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        try {
          const res = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const jsonRes = await res.json();

          if (jsonRes.success) {
            // Saving the token in SecureStore
            await SecureStore.setItemAsync("userToken", jsonRes.data.token);
            props.dispatch({ type: "SIGN_IN", token: jsonRes.data.token });
          }
          return jsonRes;
        } catch (error) {
          return error;
        }
      },
    }),
    []
  );

  return <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>;
}

export { AuthContext, AuthContextProvider };

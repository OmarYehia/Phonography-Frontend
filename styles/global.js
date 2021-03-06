import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  titleText: {
    fontFamily: "nunito-bold",
    fontSize: 18,
    color: "#333",
  },
  normalText: {
    fontFamily: "nunito-regular",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 3,
    // lineHeight: 20,
  },
  textLink: {
    fontFamily: "nunito-regular",
    fontSize: 16,
    textAlign: "center",
    color: "blue",
    textDecorationLine: "underline",
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 6,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 8,
  },
});

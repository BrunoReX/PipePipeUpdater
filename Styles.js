import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 120,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: 5,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  text: {
    color: "#000",
    fontSize: 36,
    textTransform: "uppercase",
  },
  textTitle: {
    color: "#690837",
    fontSize: 38,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: -60,
  },
  checkbox: {
    alignSelf: "center",
  },
  checkText: {
    margin: 5,
  },
});

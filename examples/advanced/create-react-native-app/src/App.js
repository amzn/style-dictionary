import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, PixelRatio } from "react-native";
import * as variables from "./style-dictionary-dist/variables";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testing! Testing!</Text>
      <Text style={styles.p}>All done!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: variables.colorBrand01,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: PixelRatio.getFontScale() * variables.sizeFontMd.scale,
    color: variables.colorBrand02,
  },
  p: {
    fontSize: PixelRatio.getFontScale() * variables.sizeFontSm.number,
    color: variables.colorBrand02,
  },
});

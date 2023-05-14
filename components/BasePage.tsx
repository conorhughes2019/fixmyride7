import React from "react";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import { darkModeColors } from "../constants";
import { AppTheme } from "../store/state";

function BasePage(props) {
  return (
    <SafeAreaProvider>
      <View
        style={{
          paddingTop: 10,
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          backgroundColor: AppTheme.get().primaryBackground,
          ...props.styles,
        }}
      >
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          {props.children}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default BasePage;

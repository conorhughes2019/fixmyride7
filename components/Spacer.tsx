import React from "react";
import { View, ViewStyle } from "react-native";

function Spacer({
  height = 0,
  width = 0,
  color = "transparent",
  styles = {},
}: {
  height?: string | number;
  width?: string | number;
  color?: string;
  styles?: ViewStyle;
}) {
  return <View style={{ width, height, backgroundColor: color, ...styles }} />;
}

export default Spacer;

import React from "react";
import { Text as RNText, StyleSheet } from "react-native";
import { AppTheme } from "../store/state";

const styles = StyleSheet.create({
  text: {
    color: AppTheme.primaryText.get(),
  },
});

const BaseText = ({ style, children, ...props }) => (
  <RNText style={[styles.text, style]} {...props}>
    {children}
  </RNText>
);
``;
export default BaseText;

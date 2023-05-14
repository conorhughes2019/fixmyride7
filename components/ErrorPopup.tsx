import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import BaseText from "./BaseText";
import { AppTheme } from "../store/state";

const ErrorPopup = ({
  text,
  duration,
  clearError,
}: {
  text: string;
  duration: number;
  clearError: () => void;
}) => {
  useEffect(() => {
    setTimeout(() => {
      clearError();
    }, duration);
  }, []);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "crimson",
        borderRadius: 5,
        margin: 5,
      }}
    >
      <MaterialCommunityIcons
        name="alert"
        size={18}
        color={AppTheme.primaryText.get()}
      />
      <BaseText
        style={{
          textAlign: "center",

          marginLeft: 10,
        }}
      >
        {text}
      </BaseText>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default ErrorPopup;

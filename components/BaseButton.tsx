import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  ActivityIndicatorProps,
  ColorValue,
} from "react-native";
import { darkModeColors } from "../constants";
import { AppTheme } from "../store/state";
import BaseText from "./BaseText";

function BaseButton({
  label,
  children,
  styles = {},
  labelStyles = {},
  onPress,
  indicatorSize = "small",
  indicatorColor = AppTheme.get().primaryText,
  loading = false,
  variant = "primary",
}: {
  label?: string;
  children?: React.ReactNode;
  styles?: ViewStyle;
  labelStyles?: TextStyle;
  loading?: boolean;
  indicatorSize?: "small" | "large";
  indicatorColor?: ColorValue;
  onPress: () => void;
  variant?: "primary" | "secondary";
}) {
  const [isPressing, setIsPressing] = useState(false);

  const handlePressIn = () => {
    setIsPressing(true);
  };

  const handlePressOut = () => {
    setIsPressing(false);
  };

  const buttonColor =
    variant === "primary"
      ? AppTheme.get().accent
      : AppTheme.get().accentSuperLight;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? AppTheme.get().accentLight : buttonColor,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
          borderRadius: 10,
          width: "100%",
          ...styles,
        },
        isPressing && { opacity: 0.7 },
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      ) : label ? (
        <BaseText
          style={{
            fontWeight: "bold",
            color:
              variant === "primary"
                ? AppTheme.get().primaryText
                : AppTheme.get().accent,
            ...labelStyles,
          }}
        >
          {label}
        </BaseText>
      ) : (
        children
      )}
    </Pressable>
  );
}

export default BaseButton;

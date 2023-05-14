import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import BaseText from "./BaseText";

const ListItem = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) => (
  <View
    style={{
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.2)",
      paddingVertical: 5,
      marginBottom: 1,
    }}
  >
    <BaseText style={{ fontWeight: "bold", marginBottom: 5 }}>{label}</BaseText>
    {children ? (
      children
    ) : (
      <BaseText style={{ fontSize: 12 }}>{value}</BaseText>
    )}
  </View>
);

export default ListItem;

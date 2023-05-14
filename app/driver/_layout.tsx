import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "rgb(21,21,21)",
        },
      }}
    >
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />

      <Stack.Screen name="orders" options={{ title: "My Orders" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen
        name="chats"
        options={{
          headerShown: false,
          title: "Chats",
        }}
      />
    </Stack>
  );
};

export default _layout;

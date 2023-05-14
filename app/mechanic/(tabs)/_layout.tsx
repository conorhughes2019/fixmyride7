import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { darkModeColors } from "../../../constants";
import { AppTheme } from "../../../store/state";

export default function TabsContainer() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: AppTheme.get().secondaryBackground,
        },
        tabBarActiveTintColor: "white",
        tabBarStyle: { backgroundColor: AppTheme.get().secondaryBackground },
      }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="inbox-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="chat-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="account-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

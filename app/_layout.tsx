import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { Stack } from "expo-router";
import { Platform, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AppLayout() {
  return (
    <AlertNotificationRoot theme="dark">
      <ActionSheetProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{}} />
          <Stack.Screen name="mechanic" options={{}} />
          <Stack.Screen name="driver" options={{}} />
        </Stack>
      </ActionSheetProvider>
    </AlertNotificationRoot>
  );
}

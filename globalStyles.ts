import { ViewStyle } from "react-native";
import { AppTheme } from "./store/state";
type RootStylesType = {
  [key: string]: ViewStyle;
};

export const RootStyles: RootStylesType = {
  card: {
    backgroundColor: AppTheme.get().secondaryBackground,
    padding: 15,
    borderRadius: 20,
    width: "100%",
  },
};

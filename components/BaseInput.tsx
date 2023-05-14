import React from "react";
import {
  TextInput,
  View,
  Text,
  InputModeOptions,
  ViewStyle,
  TextStyle,
} from "react-native";
import { darkModeColors } from "../constants";
import { AppTheme } from "../store/state";
import BaseText from "./BaseText";

function BaseInput({
  label,
  placeholder = "",
  inputMode = "none",
  styles = {},
  labelStyles = {},
  inputStyles = {},
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  error = "",
  onChangeText,
  onBlur = () => {},
}: {
  label: string;
  placeholder?: string;
  inputMode?: InputModeOptions;
  styles?: ViewStyle;
  labelStyles?: TextStyle;
  inputStyles?: ViewStyle;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <View style={{ ...styles }}>
      <BaseText
        style={{
          color: AppTheme.get().secondaryText,
          marginBottom: 10,
          ...labelStyles,
        }}
      >
        {label}
      </BaseText>
      <TextInput
        onChangeText={onChangeText}
        inputMode={inputMode}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        onBlur={onBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          backgroundColor: AppTheme.get().primaryBackground,
          paddingVertical: 3,
          paddingHorizontal: 10,

          borderRadius: 8,
          borderWidth: error ? 1 : 0,
          borderColor: error ? "red" : "transparent",
          textAlignVertical: multiline ? "top" : "center",
          ...inputStyles,
          color: AppTheme.primaryText.get(),
        }}
      />
      {error ? (
        <BaseText style={{ color: "red", marginTop: 5 }}>{error}</BaseText>
      ) : null}
    </View>
  );
}

export default BaseInput;

// const BottomSheetTextInputComponent = forwardRef<
//   TextInput,
//   BottomSheetTextInputProps & {
//     label: string;
//     styles: ViewStyle;
//     labelStyles?: TextStyle;
//     inputStyles?: ViewStyle;
//   }
// >(
//   (
//     { onFocus, onBlur, label, styles, labelStyles, inputStyles, ...rest },
//     ref
//   ) => {
//     //#region hooks
//     const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
//     //#endregion

//     //#region callbacks
//     const handleOnFocus = useCallback(
//       (args) => {
//         shouldHandleKeyboardEvents.value = true;
//         if (onFocus) {
//           onFocus(args);
//         }
//       },
//       [onFocus, shouldHandleKeyboardEvents]
//     );
//     const handleOnBlur = useCallback(
//       (args) => {
//         shouldHandleKeyboardEvents.value = false;
//         if (onBlur) {
//           onBlur(args);
//         }
//       },
//       [onBlur, shouldHandleKeyboardEvents]
//     );
//     //#endregion

//     return (
//       <View style={{ ...styles }}>
//         <BaseText style={{  marginBottom: 10, ...labelStyles }}>
//           {label}
//         </BaseText>
//         <BaseTextInput
//           ref={ref}
//           onFocus={handleOnFocus}
//           onBlur={handleOnBlur}
//           {...rest}
//           style={{
//             backgroundColor: "rgba(255,255,255,0.1)",
//             paddingVertical: 3,
//             paddingHorizontal: 10,
//
//             borderRadius: 8,
//             textAlignVertical: rest.multiline ? "top" : "center",
//             ...inputStyles,
//           }}
//         />
//       </View>
//     );
//   }
// );

// const BaseInput = memo(BottomSheetTextInputComponent);
// BaseInput.displayName = "BaseInput";

// export default BaseInput;

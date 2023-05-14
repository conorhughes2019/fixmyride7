import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useState, useRef, useMemo } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { Mechanic } from "../types/app";
import BaseButton from "./BaseButton";
import Spacer from "./Spacer";
import { darkModeColors } from "../constants";
import { AppTheme } from "../store/state";
import BaseText from "./BaseText";

const { width: sWidth } = Dimensions.get("screen");

function MechanicBottomSheet({
  mechanic,
  close,
}: {
  mechanic: Mechanic;
  close: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    //
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      onClose={() => close()}
      backgroundStyle={{ backgroundColor: AppTheme.get().secondaryBackground }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={{ uri: mechanic.image }}
          style={{ width: sWidth / 2, height: sWidth / 2, borderRadius: 100 }}
        />
        <BaseText style={{ fontSize: 20, fontWeight: "bold" }}>
          {mechanic.name}
        </BaseText>
        <BaseText style={{ opacity: 0.6 }}>
          {mechanic.availableTime.start} - {mechanic.availableTime.end}
        </BaseText>
        <BaseText style={{ opacity: 0.6 }}>
          {mechanic.availableDays.join(" - ")}
        </BaseText>
      </View>
    </BottomSheet>
  );
}

export default MechanicBottomSheet;

import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useState, useRef, useMemo } from "react";
import { View, Text } from "react-native";
import MapView, {
  LatLng,
  Marker,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { mapStyle } from "../constants";
import BaseButton from "./BaseButton";
import Spacer from "./Spacer";
import { AppTheme } from "../store/state";
import BaseText from "./BaseText";

function LocationSelector({
  region,
  onFinish,
}: {
  region: Region;
  onFinish: (value: LatLng) => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["63%"], []);
  const [location, setLocation] = useState<LatLng>({
    latitude: region.latitude,
    longitude: region.longitude,
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => onFinish(location)}
      backgroundStyle={{ backgroundColor: AppTheme.get().secondaryBackground }}
    >
      <BaseText style={{ paddingHorizontal: 20 }}>
        Hold Down and Drag the marker or click on the map to change your
        location
      </BaseText>
      {region && (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <View
            style={{
              borderRadius: 10,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <MapView
              region={region}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              onPress={(e) => {
                //
                //
                setLocation(e.nativeEvent.coordinate);
              }}
              style={{
                width: "100%",
                height: 300,
              }}
            >
              <Marker
                coordinate={location}
                draggable
                onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
              />
            </MapView>
          </View>
          <Spacer height={10} />
          <BaseButton
            label="Done"
            onPress={() => onFinish(location)}
            styles={{ width: "100%" }}
          />
        </View>
      )}
    </BottomSheet>
  );
}

export default LocationSelector;

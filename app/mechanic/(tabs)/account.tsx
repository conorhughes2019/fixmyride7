import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as ImagePicker from "expo-image-picker";
import BasePage from "../../../components/BasePage";
import { AppTheme, Store } from "../../../store/state";
import MapView, { Marker } from "react-native-maps";
import { mapStyle } from "../../../constants";
import BaseButton from "../../../components/BaseButton";
import {
  getMechanicProfile,
  setMechanicLogo,
  supabase,
} from "../../../supabase";
import ListItem from "../../../components/ListItem";
import BaseText from "../../../components/BaseText";
import { useRouter } from "expo-router";
import { Toast } from "react-native-alert-notification";

const account = () => {
  const [mechanicProfile, setMechanic] = useState(Store.mechanicProfile.get());
  const [image, setImage] = useState(null);
  const [updatingImage, setUpdatingImage] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setUpdatingImage(true);
      setImage(result.assets[0].uri);
      const { data, error } = await setMechanicLogo(result.assets[0].base64);
      if (error) {
        Toast.show({ title: "Error", textBody: error.message });
      }
      setUpdatingImage(false);
    }
  };

  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    Store.driverUser.set(null);
    router.replace("/");
  }

  useEffect(() => {
    //
  });
  useEffect(() => {
    (async () => {
      if (mechanicProfile.email) return;

      const { data, error } = await getMechanicProfile(
        Store.mechanicUser.id.get()
      );
      if (data) {
        Store.mechanicProfile.set(data);
        setMechanic(data);
      }
    })();
  });

  return (
    <BasePage styles={{ paddingVertical: 10, paddingTop: 10 }}>
      {mechanicProfile ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <Pressable
            onPress={pickImage}
            disabled={updatingImage}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 15,
              marginBottom: 5,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            {updatingImage && (
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              </View>
            )}
            {mechanicProfile.image || image ? (
              <Image
                resizeMode="contain"
                style={{
                  width: "80%",
                  height: "80%",
                  borderRadius: 10,
                }}
                source={{
                  uri: mechanicProfile.image || image,
                }}
              />
            ) : (
              <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                style={{ alignItems: "center", justifyContent: "space-evenly" }}
              >
                <MaterialCommunityIcons
                  name="image-edit-outline"
                  size={32}
                  color={AppTheme.primaryText.get()}
                />
                <BaseText style={{ marginTop: 5 }}>Add Logo</BaseText>
              </Animatable.View>
            )}
          </Pressable>
          <BaseText
            style={{
              fontSize: 20,
              fontWeight: "bold",

              marginBottom: 10,
            }}
          >
            {mechanicProfile.name}
          </BaseText>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              width: "90%",
            }}
          >
            <ListItem label="Name" value={mechanicProfile.name} />
            <ListItem
              label="Phone Number"
              value={mechanicProfile.phoneNumber}
            />
            <ListItem label="Email" value={mechanicProfile.email} />
            <ListItem
              label="Available Days"
              value={mechanicProfile.availableDays?.join(", ")}
            />
            <ListItem
              label="Available Time"
              value={`${mechanicProfile.availableTime.start} - ${mechanicProfile.availableTime.end}`}
            />
            <ListItem label="Location">
              <View
                style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}
              >
                <MapView
                  style={{ width: "100%", height: 100 }}
                  customMapStyle={mapStyle}
                  region={{
                    latitude: mechanicProfile.latitude,
                    longitude: mechanicProfile.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: mechanicProfile.latitude,
                      longitude: mechanicProfile.longitude,
                    }}
                  />
                </MapView>
              </View>
            </ListItem>
          </View>
          <BaseButton
            label="LogOut"
            onPress={() => {
              logout();
            }}
            styles={{
              width: "35%",
              marginHorizontal: 15,
              marginVertical: 10,
              backgroundColor: "crimson",
              borderRadius: 10,
            }}
            labelStyles={{ color: "white" }}
          />
        </ScrollView>
      ) : (
        <ActivityIndicator color={AppTheme.get().primaryText} size={"small"} />
      )}
    </BasePage>
  );
};

export default account;

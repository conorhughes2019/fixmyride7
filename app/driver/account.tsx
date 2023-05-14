import {
  View,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as ImagePicker from "expo-image-picker";
import BasePage from "../../components/BasePage";
import { AppTheme, Store } from "../../store/state";
import BaseButton from "../../components/BaseButton";
import { setDriverLogo, supabase } from "../../supabase";
import ListItem from "../../components/ListItem";
import BaseText from "../../components/BaseText";
import { useRouter } from "expo-router";
import { Toast } from "react-native-alert-notification";

const account = () => {
  const [driverProfile, setDriver] = useState(Store.driverProfile.get());
  const [image, setImage] = useState(null);
  const [updatingImage, setUpdatingImage] = useState(false);

  const router = useRouter();

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
      const { data, error } = await setDriverLogo(result.assets[0].base64);
      if (error) {
        Toast.show({ title: "Error", textBody: error.message });
      }
      setUpdatingImage(false);
    }
  };

  async function logout() {
    await supabase.auth.signOut();
    Store.driverUser.set(null);
    router.replace("/");
  }

  return (
    <BasePage styles={{ paddingVertical: 10, paddingTop: 10 }}>
      {driverProfile ? (
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
              borderRadius: 10,
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
            {driverProfile.image || image ? (
              <Image
                resizeMode="contain"
                style={{
                  width: "80%",
                  height: "80%",
                  borderRadius: 10,
                }}
                source={{
                  uri: driverProfile.image || image,
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
                <BaseText style={{ marginTop: 5 }}>Add Profile</BaseText>
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
            {driverProfile.name}
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
            <ListItem label="Name" value={driverProfile.name} />
            <ListItem label="Phone Number" value={driverProfile.phoneNumber} />
            <ListItem label="Email" value={driverProfile.email} />
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

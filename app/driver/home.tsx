import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AppTheme, Store } from "../../store/state";
import BasePage from "../../components/BasePage";
import * as Animatable from "react-native-animatable";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import BaseButton from "../../components/BaseButton";
import { mapStyle } from "../../constants";
import { Mechanic, MechanicUser } from "../../types/app";
import MechanicBottomSheet from "../../components/MechanicBottomSheet";
import { getDriverProfile, getMechanics } from "../../supabase";
import { Link } from "expo-router";
import Spacer from "../../components/Spacer";
import { getRandomColor } from "../../utils";
import BaseText from "../../components/BaseText";
import { Toast } from "react-native-alert-notification";
import { ALERT_TYPE } from "react-native-alert-notification";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const itemWidth = screenWidth - 100;
const offset = itemWidth;
const padding = (screenWidth - itemWidth) / 2;

function MechanicCard({
  mechanic,
  index,
  scrollX,
  focusOnMechanic,
  selectMechanic,
}: {
  mechanic: Mechanic;
  index: number;
  scrollX: any;
  focusOnMechanic: (latitude: number, longitude: number) => void;
  selectMechanic: (mechanic: Mechanic) => void;
}) {
  const [randomColor] = useState(getRandomColor());

  const scale = scrollX.interpolate({
    inputRange: [
      -offset + index * offset,
      index * offset,
      offset + index * offset,
    ],
    outputRange: [0.9, 1, 0.9],
  });
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => focusOnMechanic(mechanic.latitude, mechanic.longitude)}
    >
      <Animated.View
        style={{
          backgroundColor: AppTheme.get().primaryBackground,
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          width: itemWidth,
          transform: [
            {
              scale,
            },
          ],
        }}
      >
        {mechanic.image ? (
          <Image
            source={{ uri: mechanic.image }}
            resizeMode="contain"
            style={{
              width: "100%",
              height: itemWidth / 3,
              borderRadius: 10,
              marginBottom: 5,
            }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: itemWidth / 3,
              borderRadius: 10,
              backgroundColor: AppTheme.get().secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 5,
            }}
          >
            <BaseText
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: randomColor,
              }}
            >
              {mechanic.name
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")}
            </BaseText>
          </View>
        )}

        <BaseText
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 5,
            width: "100%",
          }}
        >
          {mechanic.name}
        </BaseText>
        <BaseText
          style={{
            fontSize: 12,
            marginBottom: 0,
            width: "100%",
          }}
        >
          {mechanic.availableTime.start} - {mechanic.availableTime.end}
        </BaseText>
        <BaseText
          style={{
            fontSize: 12,
            marginBottom: 5,
            width: "100%",
          }}
        >
          {mechanic.availableDays.join(" - ")}
        </BaseText>
        <BaseButton
          label="Request"
          onPress={() => selectMechanic(mechanic)}
          variant="secondary"
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function home() {
  const [currentRegion, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic>(null);

  const [showRetry, setShowRetry] = useState(false);

  const [activeIndex, setActiveIndex] = useState({
    current: 0,
    previous: null,
  });
  const scale = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    let newIndex = Math.floor(x / itemWidth + 0.5);
    if (activeIndex.current != newIndex) {
      setActiveIndex({ current: newIndex, previous: activeIndex.current });
    }
    const currentMechanic = mechanics[activeIndex.current];
    goToRegion(currentMechanic.latitude, currentMechanic.longitude);
  };

  const [locationLoading, setLocationLoading] = useState(false);

  const getLocationAsync = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        title: "Attention",
        textBody: "You denied location access. Please allow to proceed",
        type: ALERT_TYPE.DANGER,
      });
      return;
    }
    setLocationLoading(true);
    try {
      const { coords } = await getCurrentPositionAsync();
      //
      const { latitude, longitude } = coords;
      setUserLocation({ latitude, longitude });
      goToRegion(latitude, longitude);
      setLocationLoading(false);
      await fetchMechanics();
    } catch (error) {
      Toast.show({
        title: "An Error Occured",
        textBody: error.message,
        type: ALERT_TYPE.DANGER,
      });
    }
  };

  function goToRegion(latitude: number, longitude: number) {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.02, // Adjust this value to change the zoom level
      longitudeDelta: 0.02, // Adjust this value to change the zoom level
    });
  }
  const scrollViewRef = useRef(null);

  function scrollMechanicIntoView(index: number) {
    scrollViewRef.current?.scrollTo({
      x: index * itemWidth,
      y: 0,
      animated: true,
    });
  }

  async function fetchMechanics() {
    const { data, error } = await getMechanics();
    if (data) {
      setMechanics(data);
    } else {
      //
    }
  }

  useEffect(() => {
    getLocationAsync();
    setTimeout(() => {
      if (!userLocation) {
        setShowRetry(true);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await getDriverProfile(Store.driverUser.id.get());
      if (data) {
        Store.driverProfile.set(data);
      }
    })();
  });

  return (
    <BasePage>
      {currentRegion ? (
        <>
          <View
            style={{
              position: "absolute",
              top: 20,
              right: 0,
              zIndex: 2,
              paddingTop: 20,
              paddingRight: 10,
            }}
          >
            <Link href="/driver/account" testID="account button">
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: AppTheme.accentLight.get(),
                }}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              </View>
            </Link>
            <Spacer height={10} />
            <Link href="/driver/orders" testID="orders button">
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: AppTheme.accentLight.get(),
                }}
              >
                <MaterialCommunityIcons
                  name="inbox-outline"
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              </View>
            </Link>
            <Spacer height={10} />
            <Link href="/driver/chats" testID="chats button">
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: AppTheme.accentLight.get(),
                }}
              >
                <MaterialCommunityIcons
                  name="chat-outline"
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              </View>
            </Link>
          </View>
          <MapView
            style={{ width: "100%", height: "100%" }}
            region={currentRegion}
            userInterfaceStyle="dark"
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
          >
            <Marker coordinate={userLocation} />
            {mechanics.map((mechanic, index) => (
              <Marker
                onPress={() => scrollMechanicIntoView(index)}
                key={mechanic.id}
                pinColor={"navy"}
                coordinate={{
                  latitude: mechanic.latitude,
                  longitude: mechanic.longitude,
                }}
              />
            ))}
          </MapView>
          <BaseButton
            onPress={getLocationAsync}
            loading={locationLoading}
            variant="secondary"
          >
            <MaterialCommunityIcons
              name="target"
              size={24}
              color={AppTheme.get().primaryText}
            />
          </BaseButton>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              alignItems: "center",
            }}
          >
            <ScrollView
              testID="mechanic-cards"
              ref={scrollViewRef}
              horizontal
              snapToInterval={itemWidth}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                  listener: onScroll,
                }
              )}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{
                paddingHorizontal: padding,
                alignItems: "center",
                paddingVertical: 10,
                zIndex: 1,
              }}
            >
              {mechanics.map((mechanic, index) => (
                <MechanicCard
                  key={mechanic.id}
                  mechanic={mechanic}
                  index={index}
                  scrollX={scrollX}
                  focusOnMechanic={(latitude, longitude) => {
                    goToRegion(latitude, longitude);
                  }}
                  selectMechanic={(mechanic) => setSelectedMechanic(mechanic)}
                />
              ))}
            </ScrollView>
          </View>
          {selectedMechanic && (
            <MechanicBottomSheet
              close={() => setSelectedMechanic(null)}
              mechanic={selectedMechanic}
              location={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
            />
          )}
        </>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {showRetry === false ? (
            <ActivityIndicator
              size={"large"}
              color={AppTheme.primaryText.get()}
            />
          ) : (
            <Animatable.View
              animation={"bounceIn"}
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: AppTheme.get().secondaryBackground,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <BaseText style={{ marginBottom: 10 }}>
                Something went wrong
              </BaseText>
              <BaseButton
                label="Retry"
                onPress={() => {
                  setShowRetry(false);
                  setLocationLoading(true);
                  getLocationAsync();
                  setTimeout(() => {
                    if (!userLocation) {
                      setShowRetry(true);
                    }
                  }, 5000);
                }}
                variant="secondary"
                styles={{ width: "100%", backgroundColor: "transparent" }}
              />
            </Animatable.View>
          )}
        </View>
      )}
    </BasePage>
  );
}

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { ScrollView as ScrollView2 } from "react-native-gesture-handler";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BasePage from "../../../components/BasePage";
import { Order } from "../../../types/app";
import BaseButton from "../../../components/BaseButton";
import {
  getMechanicOrders,
  getMechanicProfile,
  updateOrderProgess,
  updateOrderState,
} from "../../../supabase";
import { AppTheme, Store } from "../../../store/state";
import BottomSheet from "@gorhom/bottom-sheet";
import ListItem from "../../../components/ListItem";
import MapView, { Marker } from "react-native-maps";
import { mapStyle, mapStyleSilver } from "../../../constants";
import BaseText from "../../../components/BaseText";
import { Toast } from "react-native-alert-notification";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");

function OrderBottomSheet({
  order,
  close,
  updateOrder,
}: {
  order: Order;
  close: () => void;
  updateOrder: (id: string, state: "Ongoing" | "Rejected") => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  async function updateState(state: "Ongoing" | "Rejected") {
    //
    if (state === "Ongoing") {
      setAcceptLoading(true);
    } else {
      setDeclineLoading(true);
    }
    const { error } = await updateOrderState(order.id, state);

    if (state === "Ongoing") {
      setAcceptLoading(false);
    } else {
      setDeclineLoading(false);
    }

    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      updateOrder(order.id, state);
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        close();
        return true;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={close}
      backgroundStyle={{ backgroundColor: AppTheme.get().primaryBackground }}
    >
      <View>
        <ScrollView2
          style={{ height: "99%" }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <BaseText
            style={{
              fontSize: 18,

              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
            }}
          >
            Order Request Details
          </BaseText>
          <ListItem label="Title" value={order.title} />
          <ListItem label="Description" value={order.description} />
          <ListItem
            label="Submitted On"
            value={new Date(order.createdAt).toLocaleDateString()}
          />
          <ListItem label="Location">
            <View
              style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}
            >
              <MapView
                style={{ width: "100%", height: 100 }}
                customMapStyle={mapStyle}
                region={{
                  latitude: order.latitude,
                  longitude: order.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: order.latitude,
                    longitude: order.longitude,
                  }}
                />
              </MapView>
            </View>
          </ListItem>
          <BaseText
            style={{
              fontSize: 18,

              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginVertical: 5,
            }}
          >
            Requesting Driver Details
          </BaseText>
          <ListItem label="Name" value={order.drivers.name} />
          <ListItem label="Email" value={order.drivers.email} />
          <ListItem label="Phone Number" value={order.drivers.phoneNumber} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 10,
            }}
          >
            {declineLoading == false && (
              <BaseButton
                label="Accept"
                onPress={() => updateState("Ongoing")}
                loading={acceptLoading}
                styles={{ width: acceptLoading ? "100%" : "48.5%" }}
              />
            )}
            {acceptLoading == false && (
              <BaseButton
                label="Decline"
                onPress={() => updateState("Rejected")}
                loading={declineLoading}
                styles={{
                  backgroundColor: AppTheme.get().error,
                  width: declineLoading ? "100%" : "48.5%",
                }}
              />
            )}
          </View>
        </ScrollView2>
      </View>
    </BottomSheet>
  );
}

function OrderRequestCard({ order, open }: { order: Order; open: () => void }) {
  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        padding: 10,
        backgroundColor: AppTheme.get().tertiaryBackground,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <BaseText style={{ fontSize: 16, fontWeight: "bold" }}>
        {order.title}
      </BaseText>
      <BaseText style={{ marginBottom: 15 }}>{order.description}</BaseText>
      <BaseButton
        label="View"
        onPress={open}
        labelStyles={{ color: "white" }}
      />
    </Animatable.View>
  );
}

function CompletedCard({ order }: { order: Order }) {
  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        padding: 10,
        backgroundColor: "rgb(75,181,67)",
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <BaseText
        style={{
          fontSize: 18,

          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Order
      </BaseText>
      <ListItem label="Title" value={order.title} />
      <ListItem label="Description" value={order.description} />
      <ListItem
        label="Submitted On"
        value={new Date(order.createdAt).toLocaleDateString()}
      />
      <ListItem label="Location">
        <View style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
          <MapView
            style={{ width: "100%", height: 100 }}
            customMapStyle={mapStyleSilver}
            liteMode={true}
            region={{
              latitude: order.latitude,
              longitude: order.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
            />
          </MapView>
        </View>
      </ListItem>
      <BaseText
        style={{
          fontSize: 18,

          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Customer
      </BaseText>
      <ListItem label="Name" value={order.drivers.name} />
      <ListItem label="Name" value={order.drivers.email} />
      <ListItem label="Name" value={order.drivers.phoneNumber} />
    </Animatable.View>
  );
}

function RejectedCard({ order }: { order: Order }) {
  function acceptOrder() {
    //
  }

  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        padding: 10,
        backgroundColor: "crimson",
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <BaseText
        style={{
          fontSize: 18,

          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Order
      </BaseText>
      <ListItem label="Title" value={order.title} />
      <ListItem label="Description" value={order.description} />
      <ListItem
        label="Submitted On"
        value={new Date(order.createdAt).toLocaleDateString()}
      />
      <ListItem label="Location">
        <View style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
          <MapView
            style={{ width: "100%", height: 100 }}
            customMapStyle={mapStyle}
            liteMode={true}
            region={{
              latitude: order.latitude,
              longitude: order.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
            />
          </MapView>
        </View>
      </ListItem>
      <BaseText
        style={{
          fontSize: 18,

          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Customer
      </BaseText>
      <ListItem label="Name" value={order.drivers.name} />
      <ListItem label="Name" value={order.drivers.email} />
      <ListItem label="Name" value={order.drivers.phoneNumber} />
    </Animatable.View>
  );
}

function OngoingCard({
  order,
  updateOrder,
  updateAsComplete,
}: {
  order: Order;
  updateOrder: (progress: string) => void;
  updateAsComplete: () => void;
}) {
  const progressStops = [0, 25, 50, 75, 100];
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  async function _updateOrder(progress: string) {
    setLoading(true);
    const error = await updateOrderProgess(order.id, progress);
    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      setLoading(false);
      updateOrder(progress);
    }
  }

  async function markAsComplete() {
    setLoading2(true);
    const { error } = await updateOrderState(order.id, "Completed");
    setLoading2(false);
    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      updateAsComplete();
    }
  }

  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        padding: 10,
        backgroundColor: AppTheme.get().tertiaryBackground,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <BaseText style={{ fontSize: 16, fontWeight: "bold" }}>
        {order.title}
      </BaseText>
      <BaseText style={{ marginBottom: 15 }}>{order.description}</BaseText>
      <BaseText style={{ marginBottom: 10, fontWeight: "bold" }}>
        Set Progress
      </BaseText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 10,
        }}
      >
        {!loading ? (
          progressStops.map((stop) => (
            <BaseButton
              key={stop}
              label={`${stop}%`}
              onPress={() => _updateOrder(`${stop}`)}
              styles={{
                backgroundColor:
                  stop === parseInt(order.progress)
                    ? AppTheme.accent.get()
                    : AppTheme.primaryBackground.get(),
                width: 50,
                height: 50,
                borderRadius: 40,
              }}
              labelStyles={{
                color: stop === parseInt(order.progress) ? "black" : "white",
              }}
            />
          ))
        ) : (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={"small"} color={"white"} />
          </View>
        )}
      </View>
      {order.progress == "100" && (
        <BaseButton
          label="Mark as Completed"
          onPress={markAsComplete}
          loading={loading2}
        />
      )}
    </Animatable.View>
  );
}

const Empty = ({ text }: { text: string }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: sHeight - 250,
      }}
    >
      <MaterialCommunityIcons
        name="thought-bubble-outline"
        size={64}
        color={AppTheme.primaryText.get()}
      />
      <BaseText style={{ fontSize: 18 }}>No {text} orders</BaseText>
    </View>
  );
};

const home = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderInView, setOrderInView] = useState<Order | null>(null);

  const tabs = ["Pending", "Ongoing", "Completed", "Rejected"];
  const [activeTab, setActiveTab] = useState(0);

  const scrollViewRef = useRef(null);

  function goToTab(index: number) {
    //
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({
      x: index * sWidth,
      y: 0,
      animated: true,
    });
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / layoutMeasurement.width);
    setActiveTab(pageIndex);
  }

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await getMechanicOrders(
      Store.mechanicUser.get().id
    );
    setLoading(false);
    if (data) {
      setOrders(data);
    } else {
      Toast.show({ title: "Error", textBody: error.message });
    }
  }

  useEffect(() => {
    const mech = Store.mechanicUser.get();

    if (mech) {
      fetchOrders();
    }
    (async () => {
      const { data, error } = await getMechanicProfile(
        Store.mechanicUser.get().id
      );
      if (data) {
        Store.mechanicProfile.set(data);
      }
    })();
  }, []);

  return (
    <BasePage styles={{ paddingTop: 0 }}>
      <View style={{ width: "100%", height: "100%" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              paddingVertical: 10,
              justifyContent: "space-evenly",
            }}
          >
            {tabs.map((tab, index) => (
              <BaseButton
                key={index}
                label={tab}
                onPress={() => goToTab(index)}
                styles={{
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor:
                    activeTab == index
                      ? AppTheme.accent.get()
                      : AppTheme.tertiaryBackground.get(),
                  flex: 1,
                  marginHorizontal: 2,
                }}
                labelStyles={{
                  fontSize: 12,
                  color: activeTab == index ? "black" : "white",
                  fontWeight: activeTab == index ? "bold" : "normal",
                }}
              />
            ))}
          </View>
          {loading && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: AppTheme.get().secondaryBackground,
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            >
              <ActivityIndicator
                size={"large"}
                color={AppTheme.primaryText.get()}
              />
            </View>
          )}
          <ScrollView
            horizontal
            pagingEnabled
            onMomentumScrollEnd={handleScroll}
            style={{ width: "100%", height: "100%" }}
            ref={scrollViewRef}
          >
            <ScrollView
              style={{ width: sWidth, height: sHeight - 230 }}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
              }
            >
              {orders.filter((order) => order.state === "Pending").length ===
                0 && <Empty text="Pending" />}
              {orders
                .filter((order) => order.state === "Pending")
                .map((order) => (
                  <OrderRequestCard
                    key={order.id}
                    order={order}
                    open={() => setOrderInView(order)}
                  />
                ))}
            </ScrollView>
            <ScrollView
              style={{ width: sWidth, height: sHeight - 230 }}
              contentContainerStyle={{ padding: 10 }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
              }
            >
              {orders.filter((order) => order.state === "Ongoing").length ===
                0 && <Empty text="Ongoing" />}
              {orders
                .filter((order) => order.state === "Ongoing")
                .map((order) => (
                  <OngoingCard
                    key={order.id}
                    order={order}
                    updateAsComplete={() => {
                      const updatedOrders = orders.map((_order) =>
                        _order.id === order.id
                          ? { ..._order, state: "Completed" } // check if state has changed
                          : _order
                      );
                      setOrders(updatedOrders);

                      goToTab(2);
                    }}
                    updateOrder={(progress) => {
                      setOrders(
                        orders.map((orderr) =>
                          orderr.id === order.id
                            ? { ...orderr, progress }
                            : orderr
                        )
                      );
                    }}
                  />
                ))}
            </ScrollView>
            <ScrollView
              style={{ width: sWidth, height: sHeight - 230 }}
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
              }
            >
              {orders.filter((order) => order.state === "Completed").length ===
                0 && <Empty text="Completed" />}
              {orders
                .filter((order) => order.state === "Completed")
                .map((order) => (
                  <CompletedCard key={order.id} order={order} />
                ))}
            </ScrollView>
            <ScrollView
              style={{ width: sWidth, height: sHeight - 230 }}
              contentContainerStyle={{ padding: 10 }}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
              }
            >
              {orders.filter((order) => order.state === "Rejected").length ===
                0 && <Empty text="Rejected" />}
              {orders
                .filter((order) => order.state === "Rejected")
                .map((order) => (
                  <RejectedCard key={order.id} order={order} />
                ))}
            </ScrollView>
          </ScrollView>
        </View>
      </View>
      {orderInView && (
        <OrderBottomSheet
          order={orderInView}
          close={() => setOrderInView(null)}
          updateOrder={(id, state) => {
            const updatedOrders = orders.map((order) =>
              order.id === id ? { ...order, state: state } : order
            );
            setOrders(updatedOrders);
            setOrderInView(null);
            goToTab(1);
          }}
        />
      )}
    </BasePage>
  );
};

export default home;

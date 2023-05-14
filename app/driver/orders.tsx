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
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import MapView, { Marker } from "react-native-maps";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ListItem from "../../components/ListItem";
import BaseButton from "../../components/BaseButton";
import BasePage from "../../components/BasePage";
import { mapStyle, mapStyleSilver } from "../../constants";
import { AppTheme, Store } from "../../store/state";
import {
  updateOrderState,
  updateOrderProgess,
  getDriverOrders,
  createOrderReview,
  getDriverReviews,
  deleteOrder,
  getDriverProfile,
} from "../../supabase";
import { Order } from "../../types/app";
import Spacer from "../../components/Spacer";
import BaseInput from "../../components/BaseInput";
import ErrorPopup from "../../components/ErrorPopup";
import BaseText from "../../components/BaseText";

const { width: sWidth, height: sHeight } = Dimensions.get("screen");

function ReviewBottomSheet({
  order,
  close,
}: {
  order: Order;
  close: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["86%", "100%"], []);
  const [snapIndex, setSnapIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [review, setReview] = useState("");
  const stars = [1, 2, 3, 4, 5];
  const [rating, setRating] = useState(-1);

  async function postReview() {
    //
    if (rating === -1) {
      setErrorMessage("Please select a rating");
      return;
    }
    if (review === "") {
      setErrorMessage("Your review is empty");
      return;
    }
    setLoading(true);
    const { data, error } = await createOrderReview({
      review,
      rating,
      driverId: order.driverId,
      mechanicId: order.mechanicId,
      orderId: order.id,
    });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      //
      Store.driverReviews.set([...Store.driverReviews.get(), data]);
      Toast.show({ title: "Review Posted", type: ALERT_TYPE.SUCCESS });
      close();
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setSnapIndex(1);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setSnapIndex(0);
      }
    );

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        close();
        return true;
      }
    );
    return () => {
      backHandler.remove();
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={snapIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={close}
      backgroundStyle={{ backgroundColor: AppTheme.get().secondaryBackground }}
    >
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {errorMessage && (
          <ErrorPopup
            text={errorMessage}
            duration={1500}
            clearError={() => setErrorMessage("")}
          />
        )}
        <View
          style={{
            marginBottom: 10,
            padding: 10,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 10,
            maxHeight: snapIndex === 0 ? 300 : 0,
            overflow: "hidden",
          }}
        >
          <ListItem label="Title" value={order.title} />
          <ListItem label="Description" value={order.description} />
          <ListItem label="Mechanic" value={order.mechanics.name} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <BaseText style={{ marginBottom: 5 }}>Rate Your Experiences</BaseText>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {stars.map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                style={{ marginRight: 10 }}
              >
                {star <= rating ? (
                  <MaterialCommunityIcons
                    name="star"
                    size={30}
                    color={AppTheme.primaryText.get()}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={30}
                    color={AppTheme.primaryText.get()}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <BaseInput
          label="Describe your experience"
          multiline
          numberOfLines={8}
          onChangeText={(value) => setReview(value)}
        />
        <Spacer height={10} />
        <BaseButton label="Post" onPress={postReview} loading={loading} />
      </View>
    </BottomSheet>
  );
}

function OrderRequestCard({
  order,
  removeOrder,
}: {
  order: Order;
  removeOrder: (orderId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function _deleteOrder() {
    setDeleting(true);
    const error = await deleteOrder(order.id);
    setDeleting(false);
    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      removeOrder(order.id);
      Toast.show({ title: "Order Deleted", type: ALERT_TYPE.WARNING });
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Booking Request",
      "Are you sure you want to delete this Booking Request",
      [
        {
          text: "Yes",
          onPress: () => _deleteOrder(),
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  }

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: AppTheme.get().secondaryBackground,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
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
      <ListItem label="Mechanic Name" value={order.mechanics.name} />
      <ListItem label="Mechanic Email" value={order.mechanics.email} />
      <ListItem
        label="Mechanic Phone Number"
        value={order.mechanics.phoneNumber}
      />
      <BaseButton
        label="Delete"
        onPress={confirmDelete}
        loading={deleting}
        styles={{
          width: "100%",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: "crimson",
          marginTop: 10,
        }}
        labelStyles={{ color: "crimson" }}
        indicatorColor="crimson"
      />
    </View>
  );
}

function CompletedCard({
  order,
  openReviewCard,
}: {
  order: Order;
  openReviewCard: () => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  //
  const reviews = Store.driverReviews.get();
  let thisOrdersReview = null;
  if (reviews) {
    thisOrdersReview = reviews.find((review) => review.orderId === order.id);
  }

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "rgba(75,181,67,0.2)",
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
      <ListItem label="Mechanic Name" value={order.mechanics.name} />
      <ListItem label="Mechanic Email" value={order.mechanics.email} />
      <ListItem
        label="Mechanic Phone Number"
        value={order.mechanics.phoneNumber}
      />
      {thisOrdersReview ? (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: 10,
            marginTop: 10,
          }}
        >
          <BaseText
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Your Review
          </BaseText>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {stars.map((star) =>
              star <= thisOrdersReview.rating ? (
                <MaterialCommunityIcons
                  key={star}
                  name="star"
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              ) : (
                <MaterialCommunityIcons
                  key={star}
                  name="star-outline"
                  size={24}
                  color={AppTheme.primaryText.get()}
                />
              )
            )}
          </View>
          <BaseText style={{ color: "white" }}>
            {thisOrdersReview.review}
          </BaseText>
        </View>
      ) : (
        <BaseButton label="Leave a Review" onPress={openReviewCard} />
      )}
    </View>
  );
}

function RejectedCard({ order }: { order: Order }) {
  function acceptOrder() {
    //
  }

  return (
    <View
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
      <ListItem label="Mechanic Name" value={order.mechanics.name} />
      <ListItem label="Mechanic Email" value={order.mechanics.email} />
      <ListItem
        label="Mechanic Phone Number"
        value={order.mechanics.phoneNumber}
      />
    </View>
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
    <View
      style={{
        padding: 10,
        backgroundColor: AppTheme.get().secondaryBackground,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <ListItem label="Title" value={order.title} />
      <ListItem label="Description" value={order.description} />
      <ListItem
        label="Requested On"
        value={new Date(order.createdAt).toLocaleDateString()}
      />
      <ListItem label="Progress">
        <View
          style={{
            width: "100%",
            height: 40,
            backgroundColor: AppTheme.get().accentSuperLight,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <BaseText
            style={{
              position: "absolute",
              top: "22%",
              left: "42%",
              zIndex: 2,
              backgroundColor: AppTheme.get().primaryText,
              color: AppTheme.get().accentLight,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 20,
              fontWeight: "bold",
            }}
          >{`${order.progress}%`}</BaseText>
          {order && order.progress ? (
            <Spacer
              height={"100%"}
              width={`${order.progress}%`}
              color={AppTheme.get().accent}
            />
          ) : (
            <Spacer
              height={"100%"}
              width={"0%"}
              color={AppTheme.primaryText.get()}
            />
          )}
        </View>
      </ListItem>
      <ListItem label="Mechanic Name" value={order.mechanics.name} />
      <ListItem label="Mechanic Email" value={order.mechanics.email} />
      <ListItem
        label="Mechanic Phone Number"
        value={order.mechanics.phoneNumber}
      />
      <ListItem label="Mechanic Location">
        <View style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
          <MapView
            style={{ width: "100%", height: 100 }}
            customMapStyle={mapStyle}
            region={{
              latitude: order.mechanics.latitude,
              longitude: order.mechanics.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: order.mechanics.latitude,
                longitude: order.mechanics.longitude,
              }}
            />
          </MapView>
        </View>
      </ListItem>
    </View>
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

const orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderToReview, setOrderToReview] = useState<Order | null>(null);

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
    const { data, error } = await getDriverOrders(Store.driverUser.get().id);
    setLoading(false);
    if (data) {
      setOrders(data);
    } else {
      Toast.show({ title: "Error", textBody: error.message });
    }
    const { data: reviews, error: rError } = await getDriverReviews(
      Store.driverUser.get().id
    );
    if (rError) {
      Toast.show({ title: "Error", textBody: rError.message });
    } else {
      Store.driverReviews.set(reviews);
      //
    }
  }

  useEffect(() => {
    fetchOrders();
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
                  borderRadius: 5,
                  backgroundColor:
                    activeTab == index ? "white" : "rgba(255,255,255,0.1)",
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
              style={{ width: sWidth, height: sHeight - 180 }}
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
                    removeOrder={(id) => {
                      setOrders(orders.filter((order) => order.id !== id));
                    }}
                  />
                ))}
            </ScrollView>
            <ScrollView
              style={{ width: sWidth, height: sHeight - 180 }}
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
                          ? { ...order, state: "Completed" }
                          : order
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
              style={{ width: sWidth, height: sHeight - 180 }}
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
                  <CompletedCard
                    openReviewCard={() => setOrderToReview(order)}
                    key={order.id}
                    order={order}
                  />
                ))}
            </ScrollView>
            <ScrollView
              style={{ width: sWidth, height: sHeight - 180 }}
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
      {orderToReview && (
        <ReviewBottomSheet
          order={orderToReview}
          close={() => setOrderToReview(null)}
          //   updateOrder={(id, state) => {
          //     const updatedOrders = orders.map((order) =>
          //       order.id === id ? { ...order, state: state } : order
          //     );
          //     setOrders(updatedOrders);
          //     setOrderToReview(null);
          //     goToTab(1);
          //   }}
        />
      )}
    </BasePage>
  );
};

export default orders;

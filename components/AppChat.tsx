import React, { useCallback, useEffect, useState } from "react";
import {
  View as AnimatedView,
  Text as AnimatedText,
} from "react-native-animatable";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useObservable } from "@legendapp/state/react";
import BasePage from "./BasePage";
import { mapStyle } from "../constants";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { AppTheme, Store } from "../store/state";
import {
  getMechanicOrders,
  getDriverOrders,
  sendMessage,
  supabase,
  fetchMessages,
} from "../supabase";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Chat, defaultTheme } from "@flyerhq/react-native-chat-ui";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { TouchableHighlight } from "@gorhom/bottom-sheet";
import { MessageType, MessageTypeOverride, Order } from "../types/app";
import MapView, { Marker } from "react-native-maps";
import ListItem from "./ListItem";
import {
  Actions,
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { Image } from "react-native";
import BaseButton from "./BaseButton";
import BaseText from "./BaseText";
import { Database } from "../types/supabase";

const AppChat = () => {
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();

  async function fetchOrders() {
    setFetching(true);
    if (Store.mechanicUser.get()) {
      const { data, error } = await getMechanicOrders(
        Store.mechanicUser.id.get()
      );
      if (data) {
        setOrders(data);
      } else {
        Toast.show({
          title: "An Error Occured",
          textBody: error.message,
          type: ALERT_TYPE.DANGER,
        });
      }
    } else if (Store.driverUser.get()) {
      const { data, error } = await getDriverOrders(Store.driverUser.id.get());
      if (data) {
        setOrders(data);
      } else {
        Toast.show({
          title: "An Error Occured",
          textBody: error.message,
          type: ALERT_TYPE.DANGER,
        });
      }
    }
    setFetching(false);
  }
  useEffect(() => {
    //
    fetchOrders();
  }, []);
  return (
    <BasePage>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 30,
        }}
      >
        {selectedOrder ? (
          <ChatComponent
            order={selectedOrder}
            back={() => setSelectedOrder(null)}
          />
        ) : (
          <AnimatedView
            animation={"fadeInDown"}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 40,
            }}
          >
            <TouchableHighlight
              onPress={() => router.back()}
              style={{
                padding: 10,
                borderRadius: 20,
                backgroundColor: AppTheme.get().secondaryBackground,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={18}
                color={AppTheme.get().primaryText}
              />
            </TouchableHighlight>
            <Text
              style={{
                color: AppTheme.get().primaryText,
                fontSize: 25,
                width: "70%",
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Select an Order and Start Chatting
            </Text>
            {fetching ? (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  size={"small"}
                  color={AppTheme.get().primaryText}
                />
              </View>
            ) : (
              <ScrollView
                style={{ height: "100%", flex: 1, width: "100%", padding: 10 }}
                refreshControl={
                  <RefreshControl
                    refreshing={fetching}
                    onRefresh={fetchOrders}
                  />
                }
              >
                {orders.map((order, index) => (
                  <AnimatedView
                    animation={"fadeInUp"}
                    delay={index * 80}
                    key={order.id}
                    style={{
                      backgroundColor: AppTheme.get().secondaryBackground,
                      borderRadius: 10,
                      marginBottom: 15,
                      overflow: "hidden",
                    }}
                  >
                    <TouchableHighlight
                      onPress={() => setSelectedOrder(order)}
                      style={{ padding: 10 }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <BaseText
                            style={{
                              fontSize: 18,
                              color: AppTheme.get().primaryText,
                              fontWeight: "bold",
                            }}
                          >
                            {order.title}
                          </BaseText>
                          <BaseText
                            style={{
                              fontSize: 14,
                              color: AppTheme.get().primaryText,
                            }}
                          >
                            {order.description}
                          </BaseText>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={AppTheme.get().primaryText}
                        />
                      </View>
                    </TouchableHighlight>
                  </AnimatedView>
                ))}
              </ScrollView>
            )}
          </AnimatedView>
        )}
      </View>
    </BasePage>
  );
};

const ChatComponent = ({ order, back }: { order: Order; back: () => void }) => {
  const [userProfile] = useState(
    Store.driverProfile.get() || Store.mechanicProfile.get()
  );
  const [userDetails] = useState(
    Store.driverUser.get() || Store.mechanicUser.get()
  );
  const [rerender, setRerender] = useState(Math.random());
  const [supaMessages, setSupaMessages] = useState([]);
  const messageText = useObservable("");
  const [attachImage, setAttachImage] = useState<
    MessageTypeOverride["image"] | null
  >(null);
  //   const [messages, setMessages] = useState<IMessage[]>([]);

  const messageStore = useObservable({
    messages: [],
  });

  const onSend = useCallback(async (message: IMessage, attachImage: any) => {
    const GfMessage: IMessage = {
      ...message,
      image: attachImage?.base64,
    };
    messageStore.messages.unshift(GfMessage);

    const supaMessage: MessageTypeOverride = {
      id: GfMessage._id as string,
      order_id: order.id,
      driver_id: order.driverId,
      mechanic_id: order.mechanicId,
      message: GfMessage.text,
      image: attachImage,
      sender_id: userDetails.id,
      sender_type: userDetails.user_metadata.accountType + "s",
    };
    setRerender(Math.random());
    messageText.set("");
    setAttachImage(null);
    try {
      const { data, error: err } = await sendMessage(supaMessage);
      if (err) {
        Toast.show({
          title: "Error Sending Message",
          textBody: err.message,
          type: ALERT_TYPE.DANGER,
        });
      } else {
      }
    } catch (error) {
      Toast.show({
        title: "Error Sending Message",
        textBody: error,
        type: ALERT_TYPE.DANGER,
      });
    }
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
    if (result.canceled) return;
    const image: MessageTypeOverride["image"] = {
      base64: `data:image/*;base64,${result.assets[0].base64}`,
      content_type: `image/${result.assets[0].uri.split(".").pop()}`,
    };
    setAttachImage(image);
  };

  function mapSupabaseMessagesToGiftChat(data: any) {
    const GfMessages = data.map((message) => {
      const GfMessage: IMessage = {
        _id: message.id,
        text: message.message,
        image: message.image,
        createdAt: new Date(message.sent_at),
        user: {
          _id: message.sender_id,
          name:
            message.sender_type === "drivers"
              ? message.drivers.name
              : message.mechanics.name,
          avatar:
            message.sender_type === "drivers"
              ? message.drivers.image
              : message.mechanics.image,
        },
      };
      return GfMessage;
    });
    return GfMessages;
  }

  useEffect(() => {
    fetchMessages(order.id)
      .then(({ data, error }) => {
        if (data) {
          const GfMessages = mapSupabaseMessagesToGiftChat(data);
          setSupaMessages(data);
          //   setMessages(GfMessages);
          messageStore.messages.set(GfMessages);
          setRerender(Math.random());
        } else {
          Toast.show({
            title: "An Error Occured",
            textBody: error.message,
            type: ALERT_TYPE.DANGER,
          });
        }
      })
      .catch((err) => {
        Toast.show({
          title: "An Error Occured",
          textBody: err.message,
          type: ALERT_TYPE.DANGER,
        });
      });
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `order_id=eq.${order.id}`,
        },
        (payload) => {
          const mutatedMessage = {
            ...payload.new,
            drivers: supaMessages[0]?.drivers || {
              name: "test driver",
              image: "",
            },
            mechanics: supaMessages[0]?.mechanics || {
              name: "test mech",
              image: "",
            },
          };
          const GfMessages = mapSupabaseMessagesToGiftChat([mutatedMessage]);
          if (mutatedMessage.sender_id === userDetails.id) return;
          messageStore.messages.set([
            GfMessages[0],
            ...messageStore.messages.get(),
          ]);
          setRerender(Math.random());
        }
      )
      .subscribe();

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      back();
      return true;
    });
    return () => {
      handler.remove();
      channel.unsubscribe();
    };
  }, []);

  return (
    <AnimatedView
      animation={"slideInRight"}
      style={{
        width: "100%",
        paddingHorizontal: 10,
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          elevation: 10,
        }}
      >
        <TouchableHighlight
          onPress={back}
          style={{
            padding: 10,
            borderRadius: 20,
            backgroundColor: AppTheme.get().secondaryBackground,
            marginRight: 10,
            marginTop: 5,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={18}
            color={AppTheme.get().primaryText}
          />
        </TouchableHighlight>
        <OrderViewer order={order} />
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messageStore.messages.get()}
          onSend={(messages) => {
            //
            onSend(messages[0], attachImage);
          }}
          user={{
            _id: userDetails.id,
            avatar: userProfile.image,
            name: userProfile.name,
          }}
          messagesContainerStyle={{
            height: "90%",
          }}
          textInputProps={{
            style: {
              flex: 1,
              color: AppTheme.primaryText.get(),
            },
          }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  left: {
                    color: AppTheme.get().primaryText,
                  },
                  right: {
                    color: AppTheme.get().primaryText,
                  },
                }}
                wrapperStyle={{
                  left: {
                    padding: 5,
                    backgroundColor: AppTheme.get().secondaryBackground,
                  },
                }}
              />
            );
          }}
          renderActions={() => (
            <TouchableHighlight
              underlayColor={AppTheme.get().accent}
              onPress={handlePickImage}
              style={{
                padding: 10,
                margin: 5,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
              }}
            >
              <MaterialCommunityIcons
                name="message-image-outline"
                size={20}
                color={AppTheme.get().primaryText}
              />
            </TouchableHighlight>
          )}
          renderInputToolbar={(props) => (
            <>
              {attachImage && (
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    paddingBottom: 50,
                    backgroundColor: AppTheme.get().tertiaryBackground,
                    borderRadius: 20,
                    alignItems: "center",
                    marginTop: -120,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                      backgroundColor: AppTheme.get().primaryBackground,
                      alignContent: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <TouchableHighlight
                      onPress={() => setAttachImage(null)}
                      underlayColor={AppTheme.get().error}
                      style={{ padding: 8 }}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={18}
                        color={AppTheme.get().primaryText}
                      />
                    </TouchableHighlight>
                  </View>

                  <Image
                    source={{ uri: attachImage.base64 }}
                    style={{
                      aspectRatio: 1,
                      width: 100,
                      borderRadius: 20,
                    }}
                    resizeMode="center"
                  />
                </View>
              )}
              <InputToolbar
                {...props}
                primaryStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                containerStyle={{
                  backgroundColor: AppTheme.get().secondaryBackground,
                  transform: [{ translateY: -10 }],
                  borderTopWidth: 0,
                  borderRadius: 25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              />
            </>
          )}
          renderSend={(props) => (
            <Send {...props}>
              <View style={{ marginHorizontal: 10, marginBottom: -18 }}>
                <MaterialCommunityIcons
                  name="send"
                  size={18}
                  color={AppTheme.get().primaryText}
                />
              </View>
            </Send>
          )}
        />
      </View>
    </AnimatedView>
  );
};

const OrderViewer = ({ order }: { order: Order }) => {
  const [expand, setExpand] = useState(false);

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: AppTheme.get().secondaryBackground,
        borderRadius: 10,
        position: "relative",
        flex: 1,
        marginBottom: 10,
      }}
    >
      <TouchableHighlight
        style={{ width: "100%", borderRadius: 10 }}
        underlayColor={AppTheme.get().accentSuperLight}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpand(!expand);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BaseText
            style={{
              fontSize: 16,
              color: AppTheme.get().primaryText,
              fontWeight: "bold",
            }}
          >
            {order.title}
          </BaseText>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 40,
              padding: 5,
              transform: [{ rotate: expand ? "180deg" : "0deg" }],
            }}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={AppTheme.get().primaryText}
            />
          </View>
        </View>
      </TouchableHighlight>
      <View style={{ maxHeight: expand ? 200 : 0, overflow: "hidden" }}>
        <BaseText
          style={{
            fontSize: 14,
            color: AppTheme.get().primaryText,
          }}
        >
          {order.description}
        </BaseText>
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
      </View>
    </View>
  );
};

export default AppChat;

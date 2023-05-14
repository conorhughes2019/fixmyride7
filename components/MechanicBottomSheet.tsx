import BottomSheet from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppTheme, Store } from "../store/state";
import { getAMechanicReviews, sendRequest } from "../supabase";
import {
  DatabaseReview,
  DatabaseReviewWithDriver,
  Mechanic,
  MechanicUser,
  Order,
  RatingStats,
} from "../types/app";
import { Database } from "../types/supabase";
import { getRandomColor, hasDecimalPart } from "../utils";
import BaseButton from "./BaseButton";
import BaseInput from "./BaseInput";
import Spacer from "./Spacer";
import { ScrollView as ScrollView2 } from "react-native-gesture-handler";
import BaseText from "./BaseText";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const { width: sWidth } = Dimensions.get("screen");
const stars = [1, 2, 3, 4, 5];

function MechanicBottomSheet({
  mechanic,
  location,
  close,
}: {
  mechanic: MechanicUser;
  location: { latitude: number; longitude: number };
  close: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["78%", "95%"], []);
  const [snapIndex, setSnapIndex] = useState(0);

  const [randomColor] = useState(getRandomColor());

  const [uploading, setUploading] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    //
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  async function requestOrder() {
    const driver = Store.driverUser.get();
    //
    const order: Order = {
      title,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      driverId: driver.id,
      mechanicId: mechanic.id,
    };
    setUploading(true);
    const error = await sendRequest(order);
    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      Toast.show({ title: "Request Sent", type: ALERT_TYPE.SUCCESS });
    }
    setUploading(false);
    close();
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
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      backHandler.remove();
    };
  }, []);

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={snapIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        onClose={() => close()}
        backgroundStyle={{
          backgroundColor: AppTheme.get().secondaryBackground,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          {mechanic.image ? (
            <Image
              source={{ uri: mechanic.image }}
              style={{
                width: snapIndex === 0 ? sWidth / 3.5 : sWidth / 5,
                height: snapIndex === 0 ? sWidth / 3.5 : sWidth / 5,
                marginBottom: 5,
                borderRadius: 100,
              }}
            />
          ) : (
            <View
              style={{
                width: snapIndex === 0 ? sWidth / 3.5 : sWidth / 5,
                height: snapIndex === 0 ? sWidth / 3.5 : sWidth / 5,
                marginBottom: 5,
                borderRadius: 100,
                backgroundColor: AppTheme.get().accentSuperLight,
                alignItems: "center",
                justifyContent: "center",
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
                  .map((name) => name.charAt(0).toUpperCase())
                  .join("")}
              </BaseText>
            </View>
          )}

          <BaseText
            style={{
              fontSize: 20,
              marginBottom: 8,
              fontWeight: "bold",
            }}
          >
            {mechanic.name}
          </BaseText>
          <BaseText style={{ opacity: 0.6 }}>
            {mechanic.availableTime.start}-{mechanic.availableTime.end}
          </BaseText>
          <BaseText style={{ opacity: 0.6 }}>
            {mechanic.availableDays?.join(" - ")}
          </BaseText>
          <BaseButton
            label="Reviews"
            onPress={() => setOpenProfile(true)}
            styles={{
              marginTop: 5,
              backgroundColor: "transparent",
            }}
            labelStyles={{ textDecorationLine: "underline" }}
          />
          <View style={{ width: "100%", padding: 20 }}>
            <BaseInput
              label="Type of Service"
              onChangeText={(text) => setTitle(text)}
              styles={{ width: "100%", marginBottom: 15 }}
            />
            <BaseInput
              label="Description"
              multiline={true}
              numberOfLines={5}
              onChangeText={(text) => setDescription(text)}
              styles={{ width: "100%", marginBottom: 20 }}
              inputStyles={{ paddingVertical: 10 }}
            />
            <BaseButton
              label="Send Request"
              loading={uploading}
              onPress={requestOrder}
            />
          </View>
        </View>
      </BottomSheet>
      {openProfile && (
        <MechanicProfile
          mechanic={mechanic}
          close={() => setOpenProfile(false)}
        />
      )}
    </>
  );
}

function MechanicProfile({
  mechanic,
  close,
}: {
  mechanic: MechanicUser;
  close: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["56%", "90%", "100%"], []);
  const [snapIndex, setSnapIndex] = useState(0);

  const [fetching, setFetching] = useState(false);

  const [ratingStats, setRatingStats] = useState<RatingStats>(null);
  const [reviews, setReviews] = useState<DatabaseReviewWithDriver[]>([]);

  const getRatingStats = (reviews: DatabaseReview[]): RatingStats => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatings = 0;

    for (const review of reviews) {
      const rating = review.rating;
      if (typeof rating === "number" && rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
        totalRatings++;
      }
    }

    const averageRating = totalRatings > 0 ? totalRatings / reviews.length : 0;
    const ratingPercentages = {};
    for (let rating = 1; rating <= 5; rating++) {
      const count = ratingCounts[rating];
      ratingPercentages[rating] = Math.round(
        count > 0 ? (count / totalRatings) * 100 : 0
      );
    }

    return { averageRating, ratingPercentages };
  };

  async function getMechanicsReviews() {
    setFetching(true);
    const { data, error } = await getAMechanicReviews(mechanic.id);
    setFetching(false);
    if (error) {
      Toast.show({ title: "Error", textBody: error.message });
    } else {
      const ratingStats = getRatingStats(data);
      //
      setRatingStats(ratingStats);
      setReviews(data);
    }
  }

  useEffect(() => {
    getMechanicsReviews();
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={snapIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => close()}
      backgroundStyle={{ backgroundColor: "#373737" }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <BaseText
          style={{
            fontSize: 20,
            marginBottom: 8,
            fontWeight: "bold",
          }}
        >
          {mechanic.name}
        </BaseText>
        {ratingStats ? (
          <View
            style={{
              width: "100%",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <View style={{ paddingHorizontal: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <View
                  style={{
                    marginRight: 10,
                  }}
                >
                  <BaseText
                    style={{
                      marginLeft: -5,
                      fontSize: 50,
                      fontWeight: "bold",
                    }}
                  >
                    {hasDecimalPart(ratingStats.averageRating)
                      ? ratingStats.averageRating
                      : ratingStats.averageRating + ".0"}
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
                      star <= ratingStats.averageRating ? (
                        hasDecimalPart(ratingStats.averageRating) ? (
                          <MaterialCommunityIcons
                            name="star-half-full"
                            size={16}
                            color="black"
                            key={star}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            key={star}
                            name="star"
                            size={16}
                            color={AppTheme.primaryText.get()}
                          />
                        )
                      ) : (
                        <MaterialCommunityIcons
                          key={star}
                          name="star-outline"
                          size={16}
                          color={AppTheme.primaryText.get()}
                        />
                      )
                    )}
                  </View>
                  <BaseText style={{ color: "white" }}>
                    {reviews.length} reviews
                  </BaseText>
                </View>
                <View
                  style={{
                    width: "60%",
                  }}
                >
                  {Object.entries(ratingStats.ratingPercentages).map(
                    (rating) => (
                      <View
                        key={rating.toString()}
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <BaseText style={{ marginRight: 5 }}>
                          {rating[0]}
                        </BaseText>
                        <View
                          style={{
                            width: "93%",
                            height: 13,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <Spacer
                            width={`${rating[1]}%`}
                            height="100%"
                            color={AppTheme.primaryText.get()}
                          />
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
              <View style={{ height: "80%" }}>
                <ScrollView2
                  style={{ height: "100%" }}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    marginTop: 20,
                  }}
                >
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ScrollView2>
              </View>
            </View>
          </View>
        ) : (
          <ActivityIndicator
            size={"large"}
            color={AppTheme.primaryText.get()}
          />
        )}
      </View>
    </BottomSheet>
  );
}

function ReviewCard({ review }: { review: DatabaseReviewWithDriver }) {
  return (
    <View
      style={{
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
      >
        {review.drivers.image ? (
          <Image
            source={{ uri: review.drivers.image }}
            style={{ width: 20, height: 20, borderRadius: 5 }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 20,
              height: 20,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ fontSize: 20 }}>
              {review.drivers.name.charAt(0)}
            </BaseText>
          </View>
        )}
        <BaseText
          style={{
            marginLeft: 10,

            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {review.drivers.name}
        </BaseText>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {stars.map((star) => (
            <View key={star} style={{ marginRight: 5 }}>
              {star <= review.rating ? (
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color={AppTheme.primaryText.get()}
                />
              ) : (
                <MaterialCommunityIcons
                  name="star-outline"
                  size={16}
                  color={AppTheme.primaryText.get()}
                />
              )}
            </View>
          ))}
        </View>
        <BaseText style={{ color: "white" }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </BaseText>
      </View>
      <BaseText style={{ fontSize: 16 }}>{review.review}</BaseText>
    </View>
  );
}

export default MechanicBottomSheet;

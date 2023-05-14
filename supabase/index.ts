import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import { Driver, MessageType, MessageTypeOverride, Order } from "../types/app";
import { Database } from "../types/supabase";
import { decode } from "base64-arraybuffer";
import { Store } from "../store/state";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = "https://hbfumtqqstjweeowvekw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZnVtdHFxc3Rqd2Vlb3d2ZWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc3NTc1NzEsImV4cCI6MTk5MzMzMzU3MX0.R-FYWyy0T2xn5IcnA8lSFu_UMzSQDBH7Nffl412hAak";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function createDriverAccount(driver: Driver) {
  const { data, error } = await supabase.auth.signUp({
    email: driver.email,
    password: driver.password,
    options: {
      data: {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        accountType: "driver",
      },
    },
  });
  if (error) {
    return { data: null, error };
  }
  const { data: profileData, error: profileError } = await supabase
    .from("drivers")
    .insert({
      id: data.user.id,
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      email: data.user.email,
    });

  return { data, error };
}

export async function loginDriver(credentials: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  return { data, error };
}

export async function getDriverProfile(userId: string) {
  let { data, error } = await supabase
    .from("drivers")
    .select()
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function createMechanicAccount(mechanic: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  latitude: number;
  longitude: number;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: mechanic.email,
    password: mechanic.password,
    options: {
      data: {
        name: mechanic.name,
        phoneNumber: mechanic.phoneNumber,
        accountType: "mechanic",
      },
    },
  });

  if (error) {
    return { data: null, error };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("mechanics")
    .insert({
      id: data.user.id,
      name: mechanic.name,
      email: data.user.email,
      phoneNumber: mechanic.phoneNumber,
      latitude: mechanic.latitude,
      longitude: mechanic.longitude,
    })
    .select();

  return { data, error };
}

export async function loginMechanic(credentials: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  return { data, error };
}

export async function getMechanicProfile(userId: string) {
  let { data, error } = await supabase
    .from("mechanics")
    .select()
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function setMechanicLogo(base64Image: string) {
  const mechanicId = Store.mechanicUser.get().id;
  const imageFileName = Date.now() + ".jpg";
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`logos/${imageFileName}`, decode(base64Image), {
      contentType: "image/jpg",
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data, error } = await supabase
    .from("mechanics")
    .update({
      image:
        "https://hbfumtqqstjweeowvekw.supabase.co/storage/v1/object/public/images/" +
        uploadData.path,
    })
    .eq("id", mechanicId)
    .select();

  return { data, error };
}

export async function setDriverLogo(base64Image: string) {
  const driverId = Store.driverUser.get().id;
  const imageFileName = Date.now() + ".jpg";
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`logos/${imageFileName}`, decode(base64Image), {
      contentType: "image/jpg",
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data, error } = await supabase
    .from("drivers")
    .update({
      image:
        "https://hbfumtqqstjweeowvekw.supabase.co/storage/v1/object/public/images/" +
        uploadData.path,
    })
    .eq("id", driverId)
    .select();

  return { data, error };
}

export async function getMechanics() {
  const { data, error } = await supabase.from("mechanics").select();
  return { data, error };
}

export async function sendRequest(order: Order) {
  const { error } = await supabase.from("orders").insert(order);
  return error;
}

export async function getMechanicOrders(mechanicId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, drivers (name , email, phoneNumber), mechanics (name , email, phoneNumber, latitude,longitude)`
    )
    .eq("mechanicId", mechanicId);
  return { data, error };
}

export async function getDriverOrders(driverId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, mechanics (name , email, phoneNumber, latitude,longitude), drivers (name , email, phoneNumber)`
    )
    .eq("driverId", driverId);
  return { data, error };
}

export async function updateOrderState(
  orderId: string,
  state: "Ongoing" | "Rejected" | "Completed"
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ state: state })
    .eq("id", orderId)
    .select()
    .single();

  return { data, error };
}

export async function updateOrderProgess(orderId: string, progress: string) {
  const { error } = await supabase
    .from("orders")
    .update({ progress: progress })
    .eq("id", orderId);
  return error;
}

export async function createOrderReview(review: {
  orderId: string;
  driverId: string;
  mechanicId: string;
  review: string;
  rating: number;
}) {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();

  return { data, error };
}

export async function getAMechanicReviews(mechanicId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`*, drivers (name,image)`)
    .eq("mechanicId", mechanicId);

  return { data, error };
}

export async function deleteOrder(orderId: string) {
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  return error;
}

export async function getDriverReviews(driverId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select()
    .eq("driverId", driverId);

  return { data, error };
}

export async function sendMessage(message: MessageTypeOverride) {
  // let imageUrl = null;
  // if (message.image) {
  //   const imageFileName = Date.now() + ".jpg";

  //   const { data: uploadData, error: uploadError } = await supabase.storage
  //     .from("images")
  //     .upload(`chatImages/${imageFileName}`, decode(message.image.base64), {
  //       contentType: message.image.content_type,
  //       // contentType: "image/jpg",
  //     });

  //   if (uploadError) {
  //     return { data: null, error: uploadError };
  //   } else {
  //     imageUrl =
  //       "https://hbfumtqqstjweeowvekw.supabase.co/storage/v1/object/public/images/" +
  //       uploadData.path;
  //   }
  // }

  const { data, error } = await supabase.from("chats").insert({
    ...message,
    image: message?.image?.base64,
  });
  if (error) {
  }
  return { data, error };
}

export async function fetchMessages(orderId: string) {
  const { data, error } = await supabase
    .from("chats")
    .select("*, drivers (name,image),mechanics (name,image)")
    .eq("order_id", orderId)
    .order("sent_at", { ascending: false });

  return { data, error };
}

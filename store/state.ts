import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { User } from "@supabase/supabase-js";
import { getDriverReviews } from "../supabase";
import { Driver, DriverUser, Mechanic, MechanicUser } from "../types/app";
import { Database } from "../types/supabase";
import {
  blackTheme,
  blueTheme,
  lightModeColors,
  purpleTheme,
} from "../constants";
import { darkTheme } from "@flyerhq/react-native-chat-ui";

interface StoreType {
  driverUser: User;
  driverReviews: Database["public"]["Tables"]["reviews"]["Row"][] | null;
  mechanicUser: User;
  mechanicProfile: Database["public"]["Tables"]["mechanics"]["Row"] | null;
  driverProfile: Database["public"]["Tables"]["drivers"]["Row"];
}

export const Store = observable<StoreType>({
  mechanicUser: null,
  mechanicProfile: null,
  driverUser: null,
  driverProfile: null,
  driverReviews: null,
});

export const AppTheme = observable(blackTheme);

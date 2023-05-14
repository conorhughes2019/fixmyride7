import { Pressable, View, Text, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import BasePage from "../components/BasePage";
import { useEffect, useState } from "react";
import { AppTheme, Store } from "../store/state";
import { supabase } from "../supabase";
import { Session } from "@supabase/supabase-js";
import BaseText from "../components/BaseText";

const App = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loggedInUser] = useState(Store.driverUser);

  function goToAccount(route: string) {
    if (
      route.includes("driver") &&
      session?.user &&
      session.user.user_metadata?.accountType === "driver"
    ) {
      Store.driverUser.set(session.user);
      router.push("/driver/home");
      return;
    }
    if (
      route.includes("mechanic") &&
      session?.user &&
      session.user.user_metadata?.accountType === "mechanic"
    ) {
      Store.mechanicUser.set(session.user);
      router.push("/mechanic");
      return;
    }
    router.push(route);
    return;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [session]);

  return (
    <BasePage
      styles={{
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        resizeMode={"contain"}
        style={{ marginTop: 40, width: 100, height: 80 }}
      />
      <BaseText
        style={{
          fontWeight: "bold",
          fontSize: 36,
          marginBottom: 20,
        }}
      >
        Fix My Ride
      </BaseText>
      <BaseText
        style={{
          fontSize: 18,

          marginBottom: 10,
          backgroundColor: AppTheme.get().secondaryBackground,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 20,
          fontWeight: "bold",
        }}
      >
        I'm a ...
      </BaseText>
      <View style={{ width: "100%" }}>
        <Pressable
          onPress={() => goToAccount("/driver/auth")}
          style={{
            alignItems: "center",
            backgroundColor: AppTheme.get().secondaryBackground,
            width: "100%",
            paddingVertical: 40,
            borderRadius: 15,
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="car-sport"
            size={64}
            color={AppTheme.primaryText.get()}
          />
          <BaseText
            style={{
              fontSize: 24,

              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Driver
          </BaseText>
        </Pressable>

        <Pressable
          onPress={() => goToAccount("/mechanic/auth")}
          style={{
            alignItems: "center",
            backgroundColor: AppTheme.get().secondaryBackground,
            width: "100%",
            paddingVertical: 40,
            borderRadius: 15,
          }}
        >
          <MaterialCommunityIcons
            name="account-hard-hat"
            size={64}
            color={AppTheme.primaryText.get()}
          />
          <BaseText
            style={{
              fontSize: 24,

              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Mechanic
          </BaseText>
        </Pressable>
      </View>
    </BasePage>
  );
};

export default App;

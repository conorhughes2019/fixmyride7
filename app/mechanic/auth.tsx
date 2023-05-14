import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import BasePage from "../../components/BasePage";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import Spacer from "../../components/Spacer";
import { RootStyles } from "../../globalStyles";
import LocationSelector from "../../components/LocationSelector";
import { LatLng } from "react-native-maps";
import { AppTheme, Store } from "../../store/state";
import { createMechanicAccount, loginMechanic, supabase } from "../../supabase";
import { isValidPhoneNumber, isValidEmail } from "../../utils";
import { useRouter } from "expo-router";
import ErrorPopup from "../../components/ErrorPopup";
import { Session } from "@supabase/supabase-js";
import BaseText from "../../components/BaseText";

function LoginForm({ setForm }: { setForm: (value: "signup") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  async function login() {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    setFormLoading(true);
    const { data, error } = await loginMechanic({ email, password });
    setFormLoading(false);
    if (data.user) {
      Store.mechanicUser.set(data.user);
      router.push("/mechanic/orders");
    } else if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <MaterialCommunityIcons
          name="account-hard-hat"
          size={64}
          color={AppTheme.primaryText.get()}
        />
        <BaseText
          style={{
            fontSize: 28,
            marginTop: 5,
            fontWeight: "bold",
          }}
        >
          Login
        </BaseText>
      </View>
      <View
        style={{
          ...RootStyles.card,
        }}
      >
        {errorMessage && (
          <ErrorPopup
            text={errorMessage}
            duration={1500}
            clearError={() => setErrorMessage("")}
          />
        )}
        <BaseInput
          label="Email"
          inputMode="email"
          onChangeText={(text: string) => setEmail(text)}
        />
        <Spacer height={10} />
        <BaseInput
          label="Password"
          secureTextEntry
          onChangeText={(text: string) => setPassword(text)}
        />
        <Spacer height={20} />
        <BaseButton label="Login" loading={formLoading} onPress={login} />
      </View>
      <BaseButton
        label="SignUp Instead"
        onPress={() => setForm("signup")}
        styles={{ backgroundColor: "transparent" }}
        labelStyles={{ textDecorationLine: "underline" }}
      />
    </>
  );
}

function SignupForm({ setForm }: { setForm: (value: "login") => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentRegion, setRegion] = useState(null);
  const [location, setLocation] = useState<LatLng>(null);

  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [gettingInitialRegion, setGettingInitialRegion] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const getLocationAsync = async () => {
    if (currentRegion) {
      setShowLocationSelector(true);
      return;
    }
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    setGettingInitialRegion(true);
    const { coords } = await getCurrentPositionAsync();
    const { latitude, longitude } = coords;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.02, // Adjust this value to change the zoom level
      longitudeDelta: 0.02, // Adjust this value to change the zoom level
    });
    setLocation({ latitude, longitude });
    setShowLocationSelector(true);
    setGettingInitialRegion(false);
  };

  async function signup() {
    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    if (name.length < 2) {
      setErrorMessage("Please enter a valid name");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    setFormLoading(true);
    const { data, error } = await createMechanicAccount({
      name,
      email,
      phoneNumber,
      password,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    setFormLoading(false);

    if (data.user) {
      Store.mechanicUser.set(data.user);
      router.push("/mechanic/account");
    } else if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <MaterialCommunityIcons
          name="account-hard-hat"
          size={50}
          color={AppTheme.primaryText.get()}
        />
        <BaseText
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Create Account
        </BaseText>
      </View>
      <View style={{ ...RootStyles.card }}>
        {errorMessage && (
          <ErrorPopup
            text={errorMessage}
            duration={1500}
            clearError={() => setErrorMessage("")}
          />
        )}
        <BaseInput
          label="Name"
          onChangeText={(text: string) => setName(text)}
        />
        <Spacer height={10} />
        <BaseInput
          label="Email"
          inputMode="email"
          onChangeText={(text: string) => setEmail(text)}
        />
        <Spacer height={10} />
        <BaseInput
          label="Phone Number"
          inputMode="numeric"
          onChangeText={(text: string) => setPhoneNumber(text)}
        />
        <Spacer height={10} />
        <BaseInput
          label="Password"
          secureTextEntry
          onChangeText={(text: string) => setPassword(text)}
        />
        <Spacer height={20} />
        <BaseInput
          label="Confirm Password"
          secureTextEntry
          onChangeText={(text: string) => setConfirmPassword(text)}
        />
        <Spacer height={10} />
        {location && (
          <>
            <BaseText style={{ color: "white" }}>
              Latitude: {location.latitude.toFixed(4)} || Longitude:
              {location.longitude.toFixed(4)}
            </BaseText>
            <Spacer height={5} />
          </>
        )}
        <BaseButton
          label={location ? "Edit Location" : "Add Location"}
          onPress={() => getLocationAsync()}
          loading={gettingInitialRegion}
          indicatorColor={"white"}
          variant="secondary"
        />
        <Spacer height={20} />

        <BaseButton loading={formLoading} label="SignUp" onPress={signup} />
      </View>
      <BaseButton
        label="Login Instead"
        onPress={() => setForm("login")}
        styles={{ backgroundColor: "transparent" }}
        labelStyles={{ textDecorationLine: "underline" }}
      />
      {showLocationSelector && (
        <LocationSelector
          region={currentRegion}
          onFinish={(value: LatLng) => {
            setShowLocationSelector(false);
          }}
        />
      )}
    </>
  );
}

function MechanicRoot() {
  const [form, setForm] = useState<"login" | "signup">("login");

  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  return (
    <BasePage styles={{ paddingTop: 38 }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          height: Dimensions.get("screen").height - 100,
          paddingHorizontal: 20,
        }}
      >
        {form === "login" ? (
          <LoginForm setForm={setForm} />
        ) : (
          <SignupForm setForm={setForm} />
        )}
      </View>
    </BasePage>
  );
}

export default MechanicRoot;

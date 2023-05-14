import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";

import BasePage from "../../components/BasePage";

import { Ionicons } from "@expo/vector-icons";

import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import Spacer from "../../components/Spacer";
import { RootStyles } from "../../globalStyles";
import { useRouter } from "expo-router";
import { createDriverAccount, loginDriver, supabase } from "../../supabase";
import { isValidEmail, isValidPhoneNumber } from "../../utils";
import { AppTheme, Store } from "../../store/state";
import ErrorPopup from "../../components/ErrorPopup";
import { Session } from "@supabase/supabase-js";
import BaseText from "../../components/BaseText";

function LoginForm({ setForm }: { setForm: (value: "signup") => void }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const { data, error } = await loginDriver({ email, password });
    //
    setFormLoading(false);
    if (data.user) {
      Store.driverUser.set(data.user);
      router.push("/driver/home");
    } else if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Ionicons
          name="car-sport"
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
          secureTextEntry={true}
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
  const [errorMessage, setErrorMessage] = useState("");

  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();

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
    const { data, error } = await createDriverAccount({
      name,
      email,
      phoneNumber,
      password,
    });
    setFormLoading(false);
    if (data) {
      Store.driverUser.set(data.user);
      router.push("/driver");
    } else if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Ionicons
          name="car-sport"
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
        <Spacer height={20} />

        <BaseButton loading={formLoading} label="SignUp" onPress={signup} />
      </View>
      <BaseButton
        label="Login Instead"
        onPress={() => setForm("login")}
        styles={{ backgroundColor: "transparent" }}
        labelStyles={{ textDecorationLine: "underline" }}
      />
    </>
  );
}

function driverRoot() {
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

export default driverRoot;

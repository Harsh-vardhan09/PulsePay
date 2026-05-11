import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";

import { Link, router } from "expo-router";

import {
  useSignIn,
  useSSO,
} from "@clerk/expo";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function SignInPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, setActive, isLoaded } = useSignIn();

  const { startSSOFlow } = useSSO();

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({
          session: completeSignIn.createdSessionId,
        });
        router.replace("/");
      } else if (completeSignIn.status === "needs_second_factor") {
        // route to MFA / verification UI
      } else if (completeSignIn.status === "needs_client_trust") {
        // start the client-trust verification step
      } else {
        Alert.alert("Sign In Incomplete", "Additional verification is required.");
      }
    } catch (err: any) {
      Alert.alert(
        "Sign In Failed",
        err?.errors?.[0]?.longMessage || "Something went wrong"
      );
    }
  };

  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",

        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "pulsepay",
        }),
      });

      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
        });

        router.replace("/");
      }
    } catch (err: any) {
      Alert.alert(
        "Google Sign In Failed",
        err?.errors?.[0]?.longMessage || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F0DD]">
      <View className="flex-1 justify-center px-6">
        {/* Logo */}

        <View className="items-center mb-12">
          <View className="flex-row items-center gap-3">
            <View className="w-14 h-14 bg-[#E0824E] rounded-2xl items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                R
              </Text>
            </View>

            <View>
              <Text className="text-2xl font-bold text-[#1E2235]">
                Recurly
              </Text>

              <Text className="text-xs text-gray-500 tracking-wide">
                SMART BILLING
              </Text>
            </View>
          </View>
        </View>

        {/* Card */}

        <View className="bg-[#F6F0DD] border border-[#DDD4BE] rounded-2xl p-5">
          <Text className="text-3xl font-bold text-center text-[#1E2235]">
            Welcome back
          </Text>

          <Text className="text-center text-gray-500 mt-2 mb-8">
            Sign in to continue managing subscriptions
          </Text>

          {/* Email */}

          <View className="mb-5">
            <Text className="text-[#1E2235] mb-2 font-medium">
              Email
            </Text>

            <TextInput
              className="border border-[#D8CFB9] rounded-xl px-4 py-4 bg-[#FBF7EA]"
              placeholder="Enter your email"
              placeholderTextColor="#8A8A8A"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          {/* Password */}

          <View className="mb-6">
            <Text className="text-[#1E2235] mb-2 font-medium">
              Password
            </Text>

            <TextInput
              className="border border-[#D8CFB9] rounded-xl px-4 py-4 bg-[#FBF7EA]"
              placeholder="Enter your password"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Sign In Button */}

          <TouchableOpacity
            onPress={onSignInPress}
            className="bg-[#E0824E] rounded-xl py-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              Sign in
            </Text>
          </TouchableOpacity>

          {/* Divider */}

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#DDD4BE]" />

            <Text className="mx-3 text-gray-400">OR</Text>

            <View className="flex-1 h-[1px] bg-[#DDD4BE]" />
          </View>

          {/* Google Button */}

          <TouchableOpacity
            onPress={onGooglePress}
            className="border border-[#D8CFB9] rounded-xl py-4 bg-white"
          >
            <Text className="text-[#1E2235] text-center font-semibold text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Footer */}

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">
              New to Recurly?{" "}
            </Text>

            <Link href="/sign-up">
              <Text className="text-[#E0824E] font-semibold">
                Create an account
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
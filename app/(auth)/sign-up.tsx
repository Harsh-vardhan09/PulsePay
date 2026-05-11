import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Link, router } from "expo-router";

import {
    useSignUp,
    useSSO,
} from "@clerk/expo";

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);

  const { signUp, fetchStatus } = useSignUp();

  const { startSSOFlow } = useSSO();

  const onSignUpPress = async () => {
    if (!signUp || fetchStatus === "fetching") return;

    try {
      const signUpResult = await signUp.create({
        emailAddress,
        password,
      });

      if (signUpResult.error) {
        throw signUpResult.error;
      }

      const sendCodeResult = await signUp.verifications.sendEmailCode();
      if (sendCodeResult.error) {
        throw sendCodeResult.error;
      }

      setVerificationPending(true);
      setVerificationCode("");

      Alert.alert(
        "Verification Code Sent",
        `A code was sent to ${emailAddress}. Enter it below to complete your account.`
      );
    } catch (err: any) {
      Alert.alert(
        "Sign Up Failed",
        err?.errors?.[0]?.longMessage || err?.message || "Something went wrong"
      );
    }
  };

  const onVerifyPress = async () => {
    if (!signUp || fetchStatus === "fetching") return;

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (verifyResult.error) {
        throw verifyResult.error;
      }

      const finalizeResult = await signUp.finalize();
      if (finalizeResult.error) {
        throw finalizeResult.error;
      }

      router.replace("/");
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err?.errors?.[0]?.longMessage || err?.message || "Unable to verify the code"
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
        "Google Sign Up Failed",
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
            Create account
          </Text>

          <Text className="text-center text-gray-500 mt-2 mb-8">
            Start managing subscriptions easily
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

          {verificationPending ? (
            <View className="mb-6">
              <Text className="text-[#1E2235] mb-2 font-medium">
                Verification code
              </Text>

              <TextInput
                className="border border-[#D8CFB9] rounded-xl px-4 py-4 bg-[#FBF7EA]"
                placeholder="Enter the code from your email"
                placeholderTextColor="#8A8A8A"
                keyboardType="number-pad"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
            </View>
          ) : null}

          {/* Sign Up Button */}

          <TouchableOpacity
            onPress={verificationPending ? onVerifyPress : onSignUpPress}
            className="bg-[#E0824E] rounded-xl py-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              {verificationPending ? "Verify code" : "Create account"}
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
              Already have an account?{" "}
            </Text>

            <Link href="/sign-in">
              <Text className="text-[#E0824E] font-semibold">
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
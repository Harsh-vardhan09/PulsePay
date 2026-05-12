import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import React from "react";

import { styled } from "nativewind";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { useClerk, useUser } from "@clerk/expo";

import { router } from "expo-router";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();

  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();

    router.replace("/(auth)/sign-in");
  };

  const displayName =
    user?.fullName || user?.firstName || "User";

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    "No email";

  return (
    <SafeAreaView className="auth-safe-area px-5">
      {/* Header */}

      <View className="mt-10 mb-8">
        <Text className="list-title">
          Settings
        </Text>
      </View>

      {/* User Card */}

      <View className="sub-card mx-3">
        <View className="home-user">
          <Image
            source={{
              uri:
                user?.imageUrl ||
                "https://ui-avatars.com/api/?name=User",
            }}
            className="home-avatar"
          />

          <View className="ml-4 flex-1">
            <Text className="sub-title">
              {displayName}
            </Text>

            <Text className="sub-meta">
              {email}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Section */}

      <View className="sub-card mt-8 mx-3">
        <Text className="list-title mb-6">
          Account
        </Text>

        {/* Account ID */}

        <View className="sub-row mb-5">
          <Text className="sub-label">
            Account ID
          </Text>

          <Text
            className="sub-value text-right"
            numberOfLines={1}
          >
            {user?.id}
          </Text>
        </View>

        {/* Joined */}

        <View className="sub-row">
          <Text className="sub-label">
            Joined
          </Text>

          <Text className="sub-value text-right">
            {user?.createdAt
              ? new Date(
                  user.createdAt
                ).toLocaleDateString("en-GB")
              : "-"}
          </Text>
        </View>
      </View>

      {/* Sign Out */}

      <TouchableOpacity
        onPress={handleSignOut}
        className="auth-button  mx-3 "
      >
        <Text className="auth-button-text">
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;


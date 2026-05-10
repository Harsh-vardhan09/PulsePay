import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
       <Link href="/(auth)/sign-in" className="mt-4 rounded p-4 bg-primary text-white">Sign In</Link>
    </View>
  )
}

export default signUp
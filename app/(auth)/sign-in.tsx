import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href="/(auth)/sign-up" className="mt-4 rounded p-4 bg-primary text-white">Create an account</Link>
      <Link href="/" className="mt-4 rounded p-4 bg-primary text-white">home</Link>
    </View>
  )
}

export default signIn
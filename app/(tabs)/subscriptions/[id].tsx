import { View, Text } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'

const subscriptionDetails = () => {
    const{id}=useLocalSearchParams<{id:string}>()
  return (
    <View>
      <Text>[id]</Text>
      <Link href="/">Go back</Link>
    </View>
  )
}

export default subscriptionDetails
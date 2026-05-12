import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/context/SubscriptionsContext';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView)


const Subscriptions = () => {
  const [searchQuery, setSearchquery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { subscriptions } = useSubscriptions()

  const filterSubscription = subscriptions.filter((subscription) => (
    subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) || subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <FlatList
          data={filterSubscription}
          keyExtractor={(item) => item.id} 
          ListHeaderComponent={
            <View className='text-3xl font-bold text-dark'>
              <Text className='text-3xl font-bold text-dark mb-5'>Subscription</Text>
              <TextInput className='bg-card rounded-xl px-4 py-3 text-dark mb-8' placeholder='Search Subsrciption...' placeholderTextColor="#666" value={searchQuery} onChangeText={setSearchquery}/>
            </View>
          }
          renderItem={({ item }) => (<SubscriptionCard {...item} expanded={expandedId === item.id} onPress={() => setExpandedId((currentId) => (currentId === item.id ? null : item.id))} />)}
          ItemSeparatorComponent={() => <View className="h-4" />}
          />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default subscriptions
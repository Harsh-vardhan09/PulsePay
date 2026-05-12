import { icons } from '@/constants/icons'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'

const categoryOptions = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
] as const

type CategoryOption = (typeof categoryOptions)[number]

type FrequencyOption = 'Monthly' | 'Yearly'

const categoryColors: Record<CategoryOption, string> = {
  Entertainment: '#f9d8d6',
  'AI Tools': '#d4e5f0',
  'Developer Tools': '#e9d8f3',
  Design: '#f5e3b8',
  Productivity: '#d9f3d8',
  Cloud: '#d7e3ff',
  Music: '#fde2f2',
  Other: '#e2e8f0',
}

export type SubscriptionPayload = {
  id: string
  name: string
  price: number
  currency: string
  frequency: FrequencyOption
  category: CategoryOption
  status: 'active' | 'paused' | 'cancelled'
  startDate: string
  renewalDate: string
  icon: typeof icons.wallet
  billing: FrequencyOption
  color: string
  paymentMethod?: string
}

interface CreateSubscriptionModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (subscription: SubscriptionPayload) => void
}

export default function CreateSubscriptionModal({ visible, onClose, onCreate }: CreateSubscriptionModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [frequency, setFrequency] = useState<FrequencyOption>('Monthly')
  const [category, setCategory] = useState<CategoryOption>('Entertainment')

  useEffect(() => {
    if (!visible) {
      setName('')
      setPrice('')
      setFrequency('Monthly')
      setCategory('Entertainment')
    }
  }, [visible])

  const parsedPrice = Number(price)
  const isNameValid = name.trim().length > 0
  const isPriceValid = !Number.isNaN(parsedPrice) && parsedPrice > 0
  const canSubmit = isNameValid && isPriceValid

  const handleSubmit = () => {
    if (!canSubmit) return

    const startDate = dayjs()
    const renewalDate = frequency === 'Monthly'
      ? startDate.add(1, 'month')
      : startDate.add(1, 'year')

    const subscription: SubscriptionPayload = {
      id: `subscription-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      currency: 'USD',
      frequency,
      category,
      status: 'active',
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.plus,
      billing: frequency,
      color: categoryColors[category] ?? '#f5f5f5',
      paymentMethod: 'Saved card',
    }

    onCreate(subscription)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='modal-overlay'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className='modal-container'
          >
            <View className='modal-header'>
              <Text className='modal-title'>New Subscription</Text>
              <Pressable onPress={onClose} className='modal-close'>
                <Text className='modal-close-text'>×</Text>
              </Pressable>
            </View>

            <View className='modal-body'>
              <View>
                <Text className='auth-label'>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder='Subscription name'
                  className='auth-input'
                  placeholderTextColor='#6b7280'
                />
              </View>

              <View>
                <Text className='auth-label'>Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder='0.00'
                  keyboardType='decimal-pad'
                  className='auth-input'
                  placeholderTextColor='#6b7280'
                />
              </View>

              <View>
                <Text className='auth-label'>Frequency</Text>
                <View className='picker-row'>
                  {(['Monthly', 'Yearly'] as FrequencyOption[]).map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setFrequency(option)}
                      className={clsx('picker-option', frequency === option && 'picker-option-active')}
                    >
                      <Text className={clsx('picker-option-text', frequency === option && 'picker-option-text-active')}>
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text className='auth-label'>Category</Text>
                <View className='category-scroll'>
                  {categoryOptions.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setCategory(option)}
                      className={clsx('category-chip', category === option && 'category-chip-active')}
                    >
                      <Text
                        className={clsx('category-chip-text', category === option && 'category-chip-text-active')}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                className={clsx('auth-button', !canSubmit && 'auth-button-disabled')}
              >
                <Text className='auth-button-text'>Create Subscription</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

import React, { useState } from 'react';
import {
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import { api } from '../api/api';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Verify() {
  const navigation = useNavigation();
  const route = useRoute();
  const [random, setRandom] = useState(route.params?.random || '');

  const submit = async () => {
    if (!random) {
      ToastAndroid.show('Please enter a code', ToastAndroid.SHORT);
      return;
    }
    try {
      await api.post('/verifyUser', {
        params: { random },
      });

      ToastAndroid.show('Verified! You can login now', ToastAndroid.SHORT);
      navigation.navigate('Login' as never);
    } catch (err) {
      ToastAndroid.show('Invalid code', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: '#fff' }}>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
        }}
        placeholder="Verification Code"
        placeholderTextColor="#000"
        value={random}
        onChangeText={setRandom}
      />

      <TouchableOpacity
        onPress={submit}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#60cdffff',
          borderRadius: 5,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Verify
        </Text>
      </TouchableOpacity>
    </View>
  );
}

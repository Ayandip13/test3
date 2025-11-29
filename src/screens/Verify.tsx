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
  const [token, settoken] = useState(route.params?.token || '');

  const submit = async () => {
    try {
      const res = await api.post('/verifyUser', {
        params: { token },
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
        placeholderTextColor="#000"
        placeholder="Verification Code"
        value={token}
        onChangeText={settoken}
      />
      <TouchableOpacity
        onPress={submit}
        style={{ marginTop: 20, padding: 10, backgroundColor: 'blue' }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

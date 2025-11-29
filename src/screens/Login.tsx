import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  Image,
  ToastAndroid,
} from 'react-native';
import { api } from '../api/api';
import { saveToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        params: { email, password },
      });

      const token = res.data?.result?.token;

      if (!token) {
        Alert.alert('Login failed Check your credentials.');
        return;
      }

      await saveToken(token);
      navigation.replace('Home' as never);
    } catch (err) {
      ToastAndroid.show('Login failed. Check your credentials.', 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 30,
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: '25%',
      }}
    >
      <TextInput
        style={{
          borderWidth: 1,
          padding: 13,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          color: '#000',
          borderColor: '#aaa',
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#555"
        placeholder="Enter email"
        onChangeText={setEmail}
      />

      <View
        style={{
          borderWidth: 1,
          borderColor: '#aaa',
          borderRadius: 5,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <TextInput
          style={{ flex: 1, paddingVertical: 13, color: '#000' }}
          placeholder="Enter password"
          placeholderTextColor="#555"
          secureTextEntry={!showPass}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Image
            source={
              showPass
                ? require('../../assets/hide.png')
                : require('../../assets/eye.png')
            }
            style={{ height: 22, width: 22 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={submit}
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#60cdffff',
          borderRadius: 5,
        }}
      >
        {loading ? (
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            Loading...
          </Text>
        ) : (
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={{ marginTop: 20, textAlign: 'center' }}>
        Don't have an account?{' '}
        <Text
          style={{ color: 'blue' }}
          onPress={() => navigation.navigate('SignUp' as never)}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import { api } from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const change = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const password = form.password.trim();
    const confirm_password = form.confirm_password.trim();

    // REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^.{6,}$/;

    if (!name || !email || !phone || !password || !confirm_password) {
      ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
      return;
    }

    if (!emailRegex.test(email)) {
      ToastAndroid.show('Invalid email format', ToastAndroid.SHORT);
      return;
    }

    if (!phoneRegex.test(phone)) {
      ToastAndroid.show('Invalid phone number', ToastAndroid.SHORT);
      return;
    }

    if (!passwordRegex.test(password)) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.SHORT,
      );
      return;
    }

    if (password !== confirm_password) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/signUp', {
        name,
        email,
        phone,
        password,
        confirm_password,
      });

      console.log('SIGNUP RESPONSE => ', res.data);

      const random = res.data?.result?.status?.code;

      if (!random) {
        ToastAndroid.show('Verification code missing', ToastAndroid.SHORT);
        return;
      }

      ToastAndroid.show('Success! Now verify your email', ToastAndroid.SHORT);

      navigation.navigate('Verify', { random });
    } catch (err: any) {
      console.log('SIGNUP ERROR => ', err.response?.data);

      const msg =
        err.response?.data?.error?.meaning || 'Signup failed. Please try again';

      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        paddingVertical: '20%',
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
      }}
    >
      <TextInput
        style={{
          borderWidth: 1,
          padding: 13,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholderTextColor="#555"
        placeholder="Enter name"
        onChangeText={t => change('name', t)}
      />

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          padding: 13,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholderTextColor="#555"
        placeholder="Enter email"
        onChangeText={t => change('email', t)}
      />

      <TextInput
        style={{
          borderWidth: 1,
          padding: 13,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        keyboardType="phone-pad"
        maxLength={10}
        placeholderTextColor="#555"
        placeholder="Enter phone number"
        onChangeText={t => change('phone', t)}
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
          onChangeText={t => change('password', t)}
        />

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Image
            source={
              showPass
                ? require('../../assets/hide.png')
                : require('../../assets/view.png')
            }
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
      </View>

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
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          secureTextEntry={!showConfirm}
          onChangeText={t => change('confirm_password', t)}
        />

        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Image
            source={
              showConfirm
                ? require('../../assets/hide.png')
                : require('../../assets/view.png')
            }
            style={{ width: 22, height: 22 }}
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
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <Text style={{ marginTop: 20, textAlign: 'center' }}>
        Already have an account?{' '}
        <Text
          style={{ color: 'blue' }}
          onPress={() => navigation.navigate('Login' as never)}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

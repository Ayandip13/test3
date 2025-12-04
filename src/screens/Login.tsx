import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/api';
import { saveToken } from '../utils/storage';
import FloatingInput from '../Component/FloatingInput';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !trimmedPassword) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      ToastAndroid.show('Invalid email format', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/auth/login', {
        params: {
          email: trimmedEmail,
          password: trimmedPassword,
        },
      });

      const token = res?.data?.result?.token;

      if (!token) {
        ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
        return;
      }

      await saveToken(token);
      navigation.replace('Home' as never);
    } catch (e) {
      ToastAndroid.show('Login failed', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/appbg.png')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 25,
              paddingTop: 40,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/back.png')}
                style={{ width: 22, height: 22, tintColor: '#fff' }}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '500',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 100,
              backgroundColor: '#fff',
              borderRadius: 20,
              paddingHorizontal: 25,
              paddingTop: 35,
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: '600', color: '#111' }}>
              Login to Your Account
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 15,
                color: '#555',
                marginBottom: 25,
              }}
            >
              Please fill below fields to login
            </Text>

            <FloatingInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FloatingInput
              label="Current Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              showToggle
              toggle={() => setShowPass(!showPass)}
              maxLength={20}
            />

            <TouchableOpacity
              onPress={submit}
              style={{
                backgroundColor: '#e63939',
                marginTop: 25,
                paddingVertical: 14,
                borderRadius: 40,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                width: '55%',
                alignSelf: 'center',
                opacity: loading ? 0.6 : 1,
                top: '25%',
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 17,
                      fontWeight: '600',
                      letterSpacing: 1,
                    }}
                  >
                    LOGIN
                  </Text>

                  <Image
                    source={require('../../assets/arrowright.png')}
                    style={{ width: 20, height: 20, tintColor: '#fff' }}
                  />
                </>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: 35, alignItems: 'center', top: '25%' }}>
              <Text style={{ color: '#fff', marginBottom: 8, fontSize: 14 }}>
                OR
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp' as never)}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                    letterSpacing: 1,
                  }}
                >
                  CREATE AN ACCOUNT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

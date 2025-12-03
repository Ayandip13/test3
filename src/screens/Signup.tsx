import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ToastAndroid,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/api';
import FloatingInput from '../Component/FloatingInput';

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
    const { name, email, phone, password, confirm_password } = form;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name || !email || !phone || !password || !confirm_password) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
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

    if (password.length < 6) {
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
      const res = await api.post('/signUp', form);

      const random = res?.data?.result?.status?.code;
      if (!random) {
        ToastAndroid.show('Verification code missing', ToastAndroid.SHORT);
        return;
      }

      navigation.navigate('Verify', { random });
    } catch (err) {
      ToastAndroid.show('Signup failed', ToastAndroid.SHORT);
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
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
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
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
              Need Some Help?
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: '28%',
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 25,
            paddingTop: 15,
            paddingBottom: 50,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '600', color: '#111' }}>
            Create an Account
          </Text>

          <Text
            style={{
              marginTop: 5,
              fontSize: 16,
              color: '#555',
              marginBottom: 25,
            }}
          >
            Please fill below fields to create account
          </Text>

          <FloatingInput
            label="Name"
            value={form.name}
            onChangeText={t => change('name', t)}
            placeholder="Enter Here"
            keyboardType="default"
            height={45}
            merginBottom={20}
          />

          <FloatingInput
            label="Email"
            value={form.email}
            keyboardType="email-address"
            onChangeText={t => change('email', t)}
            height={45}
            autoCapitalize="none"
            merginBottom={20}
          />

          <FloatingInput
            label="Phone Number"
            value={form.phone}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={t => change('phone', t)}
            height={45}
            merginBottom={20}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: -5,
            }}
          >
            {/* PASSWORD */}
            <View
              style={{
                width: '48%',
                borderWidth: 1.4,
                borderColor: '#dedede',
                borderRadius: 40,
                height: 50,
                paddingHorizontal: 20,
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                placeholder="Enter Here"
                placeholderTextColor="#A0A0A0"
                style={{ flex: 1, fontSize: 16, color: '#000' }}
                secureTextEntry={!showPass}
                onChangeText={t => change('password', t)}
              />

              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Image
                  style={{ width: 24, height: 24, tintColor: '#777' }}
                  source={
                    showPass
                      ? require('../../assets/hide.png')
                      : require('../../assets/view.png')
                  }
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM */}
            <View
              style={{
                width: '48%',
                borderWidth: 1.4,
                borderColor: '#dedede',
                borderRadius: 40,
                height: 50,
                paddingHorizontal: 20,
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                placeholder="Enter Here"
                placeholderTextColor="#A0A0A0"
                style={{ flex: 1, fontSize: 16, color: '#000' }}
                secureTextEntry={!showConfirm}
                onChangeText={t => change('confirm_password', t)}
              />

              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Image
                  style={{ width: 24, height: 24, tintColor: '#777' }}
                  source={
                    showConfirm
                      ? require('../../assets/hide.png')
                      : require('../../assets/view.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{
              color: '#666',
              marginTop: 25,
              fontSize: 14,
              lineHeight: 22,
              marginBottom: -45,
              textAlign: 'center',
            }}
          >
            By clicking on sign up, you agree that you have read & accepted our
            <Text style={{ fontWeight: '600' }}> Terms of services </Text>
            and
            <Text style={{ fontWeight: '600' }}> Privacy policy</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={submit}
            style={{
              backgroundColor: '#e63939',
              top: '16%',
              paddingVertical: 12,
              borderRadius: 40,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              width: '50%',
              alignSelf: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '600',
                letterSpacing: 1,
              }}
            >
              SIGN UP
            </Text>

            <Image
              source={require('../../assets/arrowright.png')}
              style={{ width: 20, height: 20, tintColor: '#fff' }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ color: '#eee', marginBottom: 8, fontSize: 14 }}>
            OR
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: 1,
              }}
            >
              CONTINUE TO LOGIN
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 40,
    marginBottom: 18,
    fontSize: 15,
    backgroundColor: '#fff',
  },
};

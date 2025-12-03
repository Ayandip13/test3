import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import FloatingInput from '../Component/FloatingInput';
import FloatingPicker from '../Component/FloatingPicker';

export default function EditProfile() {
  const navigation = useNavigation();

  const statesData = {
    IN: ['West Bengal', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'],
    US: ['California', 'Texas', 'New York', 'Florida', 'Washington'],
  };

  const [availableStates, setAvailableStates] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    postcode: '',
    fullAddress: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const change = (k: string, v: string) => setForm({ ...form, [k]: v });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = await getToken();

    const res = await api.post(
      '/user-details',
      {},
      { headers: { Authorization: `bearer ${token}` } },
    );

    const data = res.data?.result?.userData;

    if (data) {
      setForm(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
        phone: String(data.phone),
        country: data.country,
        state: data.state,
        city: data.city,
        postcode: String(data.postcode),
        fullAddress: data.address,
      }));

      if (statesData[data.country]) {
        setAvailableStates(statesData[data.country]);
      }
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const save = async () => {
    if (!form.name.trim()) {
      ToastAndroid.show('Please enter your name', ToastAndroid.SHORT);
      return;
    }
    if (!form.email.trim()) {
      ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      ToastAndroid.show('Invalid email format', ToastAndroid.SHORT);
      return;
    }
    if (!form.phone.trim()) {
      ToastAndroid.show('Please enter your phone number', ToastAndroid.SHORT);
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      ToastAndroid.show('Invalid phone number', ToastAndroid.SHORT);
      return;
    }
    // if (!form.country) {
    //   ToastAndroid.show('Please select your country', ToastAndroid.SHORT);
    //   return;
    // }
    if (!form.state) {
      ToastAndroid.show('Please select your state', ToastAndroid.SHORT);
      return;
    }
    if (!form.city.trim()) {
      ToastAndroid.show('Please enter your city', ToastAndroid.SHORT);
      return;
    }
    if (!/^\d{6}$/.test(form.postcode.trim())) {
      ToastAndroid.show('Invalid postal code', ToastAndroid.SHORT);
      return;
    }
    if (!form.fullAddress.trim()) {
      ToastAndroid.show('Please enter your full address', ToastAndroid.SHORT);
      return;
    }

    const updatingPassword =
      form.oldPassword.trim().length > 0 ||
      form.newPassword.trim().length > 0 ||
      form.confirmPassword.trim().length > 0;

    if (updatingPassword) {
      if (!form.oldPassword.trim()) {
        ToastAndroid.show('Enter your current password', ToastAndroid.SHORT);
        return;
      }

      if (!form.newPassword.trim()) {
        ToastAndroid.show('Enter new password', ToastAndroid.SHORT);
        return;
      }

      if (!passwordRegex.test(form.newPassword.trim())) {
        ToastAndroid.show(
          'Password must be 8+ chars, include uppercase, lowercase, number & special char',
          ToastAndroid.LONG,
        );
        return;
      }

      if (form.newPassword.trim() !== form.confirmPassword.trim()) {
        ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
        return;
      }

      if (form.oldPassword.trim() === form.newPassword.trim()) {
        ToastAndroid.show(
          'New password cannot be same as old password',
          ToastAndroid.SHORT,
        );
        return;
      }
    }

    try {
      setLoading(true);

      const token = await getToken();
      const fd = new FormData();

      Object.keys(form).forEach(k => {
        if (form[k] !== undefined && form[k] !== null) {
          fd.append(k, String(form[k]));
        }
      });

      const res = await fetch(
        'https://infowarescripts.com/dev/e-commerce/api/edit-profile',
        {
          method: 'POST',
          headers: { Authorization: `bearer ${token}` },
          body: fd,
        },
      );

      if (!res.ok) {
        ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
        return;
      }

      ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (err) {
      ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 12 : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 48,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack?.()}>
                <Image
                  source={require('../../assets/back.png')}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                Edit Profile
              </Text>
            </View>

            {/* RIGHT: fixed width, align icons to end */}
            <View
              style={{
                width: 80,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../assets/bell.png')}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
              <Image
                source={require('../../assets/search.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center', marginHorizontal: -20 }}>
            <View
              style={{
                height: 175,
                backgroundColor: '#f5f5f6',
                borderRadius: 8,
                overflow: 'hidden',
                width: '100%',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }}
              >
                <Image
                  source={require('../../assets/pencil.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: '#333',
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 4,
                    shadowColor: '#000',
                  }}
                >
                  <Image
                    source={require('../../assets/user.png')}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              </View>
              <View style={{ marginTop: '35%', alignItems: 'center' }}>
                <Text
                  style={{ fontSize: 18, fontWeight: '600', color: '#222' }}
                >
                  {form.name || 'Your Name'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Basic Information</Text>

          <FloatingInput
            label="Name"
            value={form.name}
            onChangeText={t => change('name', t)}
            placeholder="Enter Here"
          />

          <FloatingInput
            label="Email"
            value={form.email}
            onChangeText={t => change('email', t)}
            placeholder="Enter Here"
          />

          {/* PHONE */}
          <FloatingInput
            maxLength={10}
            keyboardType="phone-pad"
            label="Phone Number"
            value={form.phone}
            onChangeText={t => change('phone', t)}
            placeholder="Enter Here"
          />

          <Text style={[styles.sectionTitle, { marginTop: 5 }]}>
            Address Information
          </Text>

          <FloatingPicker
            label="Country / Region"
            selectedValue={form.country}
            onValueChange={value => {
              change('country', value);
              change('state', '');
              setAvailableStates(statesData[value] || []);
            }}
          >
            <Picker.Item label="Select Country" value="" />
            <Picker.Item label="India" value="IN" />
            <Picker.Item label="United States" value="US" />
          </FloatingPicker>

          <FloatingPicker
            label="State"
            selectedValue={form.state}
            onValueChange={value => change('state', value)}
          >
            <Picker.Item label="Select State" value="" />
            {availableStates.map(st => (
              <Picker.Item key={st} label={st} value={st} />
            ))}
          </FloatingPicker>

          {/* CITY */}
          <FloatingInput
            label="City"
            value={form.city}
            onChangeText={t => change('city', t)}
          />

          {/* POSTAL CODE */}
          <FloatingInput
            label="Postal Code"
            value={form.postcode}
            maxLength={6}
            keyboardType="numeric"
            onChangeText={t => change('postcode', t)}
          />

          <FloatingInput
            label="Full Address"
            value={form.fullAddress}
            onChangeText={t => change('fullAddress', t)}
          />

          <Text style={[styles.sectionTitle, { marginTop: 5 }]}>
            Change Password
          </Text>

          <FloatingInput
            label="Current Password"
            value={form.oldPassword}
            onChangeText={t => change('oldPassword', t)}
            secureTextEntry={!showOld}
            showToggle
            toggle={() => setShowOld(!showOld)}
            placeholder="Enter Here"
          />

          <FloatingInput
            label="New Password"
            value={form.newPassword}
            onChangeText={t => change('newPassword', t)}
            secureTextEntry={!showNew}
            showToggle
            toggle={() => setShowNew(!showNew)}
            placeholder="Enter Here"
          />

          <FloatingInput
            label="Confirm New Password"
            value={form.confirmPassword}
            onChangeText={t => change('confirmPassword', t)}
            secureTextEntry={!showConfirm}
            showToggle
            toggle={() => setShowConfirm(!showConfirm)}
            placeholder="Enter Here"
          />

          <TouchableOpacity style={styles.btn} onPress={save}>
            {loading ? (
              <Text
                style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}
              >
                Saving...
              </Text>
            ) : (
              <Text
                style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}
              >
                Save All Changes
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    color: '#000',
  },
  btn: {
    backgroundColor: '#ff2323ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  passContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  passInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },

  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#555',
  },
});

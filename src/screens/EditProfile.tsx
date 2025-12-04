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
    try {
      const token = await getToken();
      if (!token) {
        // handle missing token gracefully
        console.warn('No token found');
        return;
      }

      const res = await api.post(
        '/user-details',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data?.result?.userData;
      if (!data) return;

      // normalize country to our codes (IN/US)
      const countryCode = (data.country || '')
        .toString()
        .toLowerCase()
        .includes('india')
        ? 'IN'
        : (data.country || '').toString().toLowerCase().includes('united')
        ? 'US'
        : data.country;

      setForm(prev => ({
        ...prev,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone ? String(data.phone) : '',
        country: countryCode || '',
        state: data.state || '',
        city: data.city || '',
        postcode: data.postcode ? String(data.postcode) : '',
        fullAddress: data.address || '',
      }));

      if (statesData[countryCode]) {
        setAvailableStates(statesData[countryCode]);
      } else {
        setAvailableStates([]);
      }
    } catch (err) {
      console.warn('Failed to load user', err);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const showToastOrAlert = (msg: string, long = false) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, long ? ToastAndroid.LONG : ToastAndroid.SHORT);
    } else {
      // iOS fallback
      Alert.alert('', msg);
    }
  };

  const save = async () => {
    // basic trims
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const city = form.city.trim();
    const postcode = form.postcode.trim();
    const fullAddress = form.fullAddress.trim();

    if (!name) {
      showToastOrAlert('Please enter your name');
      return;
    }
    if (!email) {
      showToastOrAlert('Please enter your email');
      return;
    }
    if (!emailRegex.test(email)) {
      showToastOrAlert('Invalid email format');
      return;
    }

    // country-specific checks
    const country = form.country || 'IN'; // default IN if not picked
    if (!form.country) {
      showToastOrAlert('Please select your country');
      return;
    }

    if (!form.state) {
      showToastOrAlert('Please select your state');
      return;
    }

    if (!city) {
      showToastOrAlert('Please enter your city');
      return;
    }

    if (country === 'IN') {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        showToastOrAlert('Invalid phone number for India');
        return;
      }
      if (!/^\d{6}$/.test(postcode)) {
        showToastOrAlert('Invalid postal code for India');
        return;
      }
    } else if (country === 'US') {
      if (!/^\d{5}(-\d{4})?$/.test(postcode)) {
        showToastOrAlert('Invalid ZIP code for US (e.g. 12345 or 12345-6789)');
        return;
      }
      // very loose phone check for US (10 digits)
      if (!/^\d{10}$/.test(phone)) {
        showToastOrAlert('Invalid phone number for US (10 digits)');
        return;
      }
    } else {
      // fallback generic checks
      if (!phone) {
        showToastOrAlert('Please enter your phone number');
        return;
      }
    }

    if (!fullAddress) {
      showToastOrAlert('Please enter your full address');
      return;
    }

    // password update logic
    const updatingPassword =
      form.oldPassword.trim().length > 0 ||
      form.newPassword.trim().length > 0 ||
      form.confirmPassword.trim().length > 0;

    if (updatingPassword) {
      if (!form.oldPassword.trim()) {
        showToastOrAlert('Enter your current password');
        return;
      }
      if (!form.newPassword.trim()) {
        showToastOrAlert('Enter new password');
        return;
      }
      if (!passwordRegex.test(form.newPassword.trim())) {
        showToastOrAlert(
          'Password must be 8+ chars, include uppercase, lowercase, number & special char',
          true,
        );
        return;
      }
      if (form.newPassword.trim() !== form.confirmPassword.trim()) {
        showToastOrAlert('Passwords do not match');
        return;
      }
      if (form.oldPassword.trim() === form.newPassword.trim()) {
        showToastOrAlert('New password cannot be same as old password');
        return;
      }
    }

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        showToastOrAlert('Not authenticated');
        return;
      }

      const fd = new FormData();

      fd.append('name', name);
      fd.append('email', email);
      fd.append('phone', phone);
      fd.append('country', country);
      fd.append('state', form.state);
      fd.append('city', city);
      fd.append('postcode', postcode);

      const fullAddress = form.fullAddress.trim();
      fd.append('address', fullAddress);

      if (updatingPassword) {
        fd.append('oldPassword', form.oldPassword.trim());
        fd.append('newPassword', form.newPassword.trim());
      }

      const res = await fetch(
        'https://infowarescripts.com/dev/e-commerce/api/edit-profile',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );

      if (!res.ok) {
        let errMsg = 'Failed to update profile';
        try {
          const errJson = await res.json();
          if (errJson?.message) errMsg = errJson.message;
        } catch (_e) {}
        showToastOrAlert(errMsg);
        return;
      }

      showToastOrAlert('Profile updated');
      navigation.goBack();
    } catch (err) {
      console.warn(err);
      showToastOrAlert('Failed to update profile');
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
            autoCapitalize="none"
            onChangeText={t => change('email', t)}
            placeholder="Enter Here"
          />

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
              change('country', String(value));
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
            onValueChange={value => change('state', String(value))}
          >
            <Picker.Item label="Select State" value="" />
            {availableStates.map(st => (
              <Picker.Item key={st} label={st} value={st} />
            ))}
          </FloatingPicker>

          <FloatingInput
            label="City"
            value={form.city}
            onChangeText={t => change('city', t)}
          />

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

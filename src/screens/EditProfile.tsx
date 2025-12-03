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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import FloatingInput from '../Component/FloatingInput';
import FloatingPicker from '../Component/FloatingPicker';

export default function EditProfile() {
  const navigation = useNavigation();

  // STATES
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

  // LOAD USER
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

      // Load states for stored country
      if (statesData[data.country as keyof typeof statesData]) {
        setAvailableStates(statesData[data.country]);
      }
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const save = async () => {
    if (!form.name || !form.email || !form.phone) {
      ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
      return;
    }

    if (!emailRegex.test(form.email)) {
      ToastAndroid.show('Invalid email format', ToastAndroid.SHORT);
      return;
    }

    if (form.phone.length !== 10) {
      ToastAndroid.show('Phone number must be 10 digits', ToastAndroid.SHORT);
      return;
    }

    if (form.newPassword || form.confirmPassword || form.oldPassword) {
      if (!passwordRegex.test(form.newPassword)) {
        ToastAndroid.show(
          'Password must be 8+ chars, include uppercase, lowercase, number & special char',
          ToastAndroid.LONG,
        );
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
        return;
      }
    }

    try {
      setLoading(true);

      const token = await getToken();

      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));

      await fetch(
        'https://infowarescripts.com/dev/e-commerce/api/edit-profile',
        {
          method: 'POST',
          headers: { Authorization: `bearer ${token}` },
          body: fd,
        },
      );

      ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (err) {
      ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20, flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      {/* NAME */}
      <FloatingInput
        label="Name"
        value={form.name}
        onChangeText={t => change('name', t)}
      />

      {/* EMAIL */}
      <FloatingInput
        label="Email"
        value={form.email}
        onChangeText={t => change('email', t)}
      />

      {/* PHONE */}
      <FloatingInput
        label="Phone Number"
        value={form.phone}
        onChangeText={t => change('phone', t)}
      />

      {/* ------- ADDRESS INFO ------- */}
      <Text style={styles.sectionTitle}>Address Information</Text>

      {/* COUNTRY PICKER */}
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

      {/* STATE PICKER */}
      <View style={[styles.input, { borderRadius: 50 }]}>
        <Picker
          selectedValue={form.state}
          enabled={availableStates.length > 0}
          onValueChange={value => change('state', value)}
        >
          <Picker.Item label="Select State" value="" />
          {availableStates.map(st => (
            <Picker.Item key={st} label={st} value={st} />
          ))}
        </Picker>
      </View>

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
        onChangeText={t => change('postcode', t)}
      />

      {/* FULL ADDRESS */}
      <FloatingInput
        label="Full Address"
        value={form.fullAddress}
        onChangeText={t => change('fullAddress', t)}
      />

      {/* ------- PASSWORD SECTION ------- */}
      <Text style={styles.sectionTitle}>Change Password</Text>

      <FloatingInput
        label="Current Password"
        value={form.oldPassword}
        onChangeText={t => change('oldPassword', t)}
        secureTextEntry={!showOld}
        showToggle
        toggle={() => setShowOld(!showOld)}
      />

      <FloatingInput
        label="New Password"
        value={form.newPassword}
        onChangeText={t => change('newPassword', t)}
        secureTextEntry={!showNew}
        showToggle
        toggle={() => setShowNew(!showNew)}
      />

      <FloatingInput
        label="Confirm New Password"
        value={form.confirmPassword}
        onChangeText={t => change('confirmPassword', t)}
        secureTextEntry={!showConfirm}
        showToggle
        toggle={() => setShowConfirm(!showConfirm)}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={save}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>
            Save All Changes
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 10,
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
    backgroundColor: '#60cdffff',
    padding: 15,
    borderRadius: 6,
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

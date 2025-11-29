import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api/api';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
  });
  const [loading, setLoading] = useState(false);

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
      setForm({
        name: data.name,
        email: data.email,
        phone: String(data.phone),
        address: data.address,
        city: data.city,
        state: String(data.state),
        country: String(data.country),
        postcode: data.postcode,
      });
    }
  };

  const save = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.country ||
      !form.postcode
    ) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();

      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));

      const res = await fetch(
        'https://infowarescripts.com/dev/e-commerce/api/edit-profile',
        {
          method: 'POST',
          headers: { Authorization: `bearer ${token}` },
          body: fd,
        },
      );

      const json = await res.json();
      ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: '#fff' }}>
      <TextInput
        placeholder="Enter name"
        value={form.name}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        onChangeText={t => change('name', t)}
        placeholderTextColor="#555"
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholder="Enter email"
        placeholderTextColor="#555"
        value={form.email}
        onChangeText={t => change('email', t)}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        maxLength={10}
        value={form.phone}
        onChangeText={t => change('phone', t)}
        placeholderTextColor="#555"
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholder="Enter address"
        placeholderTextColor="#555"
        value={form.address}
        onChangeText={t => change('address', t)}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholderTextColor="#555"
        placeholder="Enter city"
        value={form.city}
        onChangeText={t => change('city', t)}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholderTextColor="#555"
        placeholder="Enter state"
        value={form.state}
        onChangeText={t => change('state', t)}
      />
      <TextInput
        placeholderTextColor="#555"
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholder="Enter country"
        value={form.country}
        onChangeText={t => change('country', t)}
      />
      <TextInput
        placeholderTextColor="#555"
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          marginTop: 10,
          borderColor: '#aaa',
          color: '#000',
        }}
        placeholder="Enter postal code"
        value={form.postcode}
        maxLength={6}
        keyboardType="numeric"
        onChangeText={t => change('postcode', t)}
      />

      <TouchableOpacity
        onPress={save}
        style={{
          backgroundColor: '#60cdffff',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        {loading ? (
          <Text style={{ color: 'white', textAlign: 'center' }}>Saving...</Text>
        ) : (
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Save Profile
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

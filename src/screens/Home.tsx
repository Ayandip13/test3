import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { getToken, logout } from '../utils/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '../api/api';

export default function Home() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, []),
  );

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.header}>User Details</Text>

          <Text style={styles.item}>
            <Text style={styles.label}>Name:</Text> {form.name}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>Email:</Text> {form.email}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>Phone:</Text> {form.phone}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>Full Address:</Text> {form.address}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>City:</Text> {form.city}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>State:</Text> {form.state}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>Country:</Text> {form.country}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.label}>Postcode:</Text> {form.postcode}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile' as never)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button]}
          onPress={async () => {
            await logout();
            navigation.replace('Login' as never);
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#e63939',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },

  label: {
    fontWeight: 'bold',
    color: '#333',
  },

  item: {
    marginBottom: 7,
    fontSize: 16,
    color: '#555',
  },

  bottomButtons: {
    position: 'absolute',
    bottom: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  button: {
    backgroundColor: '#e63939',
    paddingVertical: 14,
    width: '45%',
    borderRadius: 6,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#e63939',
  },

  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

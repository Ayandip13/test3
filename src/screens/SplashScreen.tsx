import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await getToken();

    setTimeout(() => {
      if (token) {
        navigation.replace('Home' as never);
      } else {
        navigation.replace('Login' as never);
      }
    }, 2000);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  toggle?: () => void;
  placeholder?: string;
  maxLength?: number;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
}

const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  showToggle,
  toggle,
  placeholder,
  maxLength,
  keyboardType,
}: FloatingInputProps) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          position: 'absolute',
          top: -10,
          left: 20,
          backgroundColor: '#fff',
          paddingHorizontal: 8,
          fontSize: 14,
          color: '#555',
          zIndex: 10,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 50,
          paddingHorizontal: 20,
          paddingVertical: 3,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Enter Here'}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          style={{ flex: 1, color: '#000', fontSize: 15 }}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />

        {showToggle && (
          <TouchableOpacity onPress={toggle}>
            <Image
              source={
                secureTextEntry
                  ? require('../../assets/view.png')
                  : require('../../assets/hide.png')
              }
              style={{ width: 22, height: 22, tintColor: '#777' }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FloatingInput;

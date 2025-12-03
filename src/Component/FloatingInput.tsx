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
    <View style={{ marginBottom: 25 }}>
      <Text
        style={{
          position: 'absolute',
          top: -12,
          left: 28,
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
          borderWidth: 1.4,
          borderColor: '#dedede',
          borderRadius: 40,
          paddingHorizontal: 20,
          height: 60,
          backgroundColor: '#fff',
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Enter Here'}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry}
          style={{
            flex: 1,
            color: '#000',
            fontSize: 16,
            paddingVertical: 0, // Makes TextInput perfect vertically
          }}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />

        {/* Password Eye Toggle */}
        {showToggle && (
          <TouchableOpacity onPress={toggle}>
            <Image
              source={
                secureTextEntry
                  ? require('../../assets/view.png')
                  : require('../../assets/hide.png')
              }
              style={{ width: 24, height: 24, tintColor: '#777' }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FloatingInput;

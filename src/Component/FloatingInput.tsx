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
  width?: number | string;
  height?: number;
  merginBottom?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
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
  merginBottom,
  width,
  height,
  autoCapitalize,
}: FloatingInputProps) => {
  return (
    <View style={{ marginBottom: merginBottom || 25, width: width || '100%' }}>
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
          height: height || 60,
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
            paddingVertical: 0,
          }}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />

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

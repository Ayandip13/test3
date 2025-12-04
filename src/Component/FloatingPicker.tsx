import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FloatingPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  children: React.ReactNode;
}

const FloatingPicker = ({
  label,
  selectedValue,
  onValueChange,
  children,
}: FloatingPickerProps) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          position: 'absolute',
          top: -10,
          left: 20,
          backgroundColor: '#fff',
          paddingHorizontal: 4,
          fontSize: 14,
          color: '#555',
          zIndex: 10,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 50,
          paddingHorizontal: 10,
          justifyContent: 'center',
        }}
      >
        <Picker
          selectedValue={selectedValue || ''}
          onValueChange={(itemValue, index) =>
            onValueChange(String(itemValue), index)
          }
          style={{ height: 50, width: '100%' }}
        >
          {children}
        </Picker>
      </View>
    </View>
  );
};
export default FloatingPicker;

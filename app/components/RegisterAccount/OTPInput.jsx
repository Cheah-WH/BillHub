
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ otp, setOtp }) => {
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const updatedOtp = otp.split('');
    updatedOtp[index] = text;
    setOtp(updatedOtp.join(''));
    // Move focus to the next input field
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace key press
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={otp[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          maxLength={1}
          keyboardType="number-pad"
          ref={(ref) => (inputRefs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default OTPInput;

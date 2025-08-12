import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeScreen() {
  const sessionId = 'f2a8e3c1d9'; // Unique session ID for this class
  const qrValue = `https://yourapp.com/attendance/${sessionId}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan to Mark Attendance</Text>
      <QRCode
        value={qrValue}   // The data the QR code encodes
        color="black"     // Foreground color
        backgroundColor="white" // Background color
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

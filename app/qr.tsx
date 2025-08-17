import { generateSession } from '@/utils/session/generateSession';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute, RouteProp } from '@react-navigation/native';

type QRRouteParams = {
  sessionId?: string;
}
export default function AttendanceScreen() {
  const route = useRoute<RouteProp<{params: QRRouteParams }>>();
  const { sessionId } = route?.params ?? {};
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

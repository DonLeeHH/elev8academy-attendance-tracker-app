import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { deleteSession } from '@/utils/session/deleteSession';

type QRRouteParams = {
  cls: string;
  classDate: string;
  sessionId?: string;
}
export default function AttendanceScreen() {
  const route = useRoute<RouteProp<{params: QRRouteParams }>>();
  const navigation = useNavigation();
  const { cls, classDate, sessionId } = route?.params ?? {};
  const qrValue = `elev8://attendance/attend?sessionId=${sessionId}`;
  console.log("QR Value:", qrValue);

    return (
    <View style={styles.container}>
      {/* Cancel button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={async () => {
          await deleteSession(cls, classDate);
          navigation.goBack();
        }}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
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
  cancelButton: {
    position: "absolute",
    top: 20, // adjust for status bar height
    right: 20,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 17,
  },
});

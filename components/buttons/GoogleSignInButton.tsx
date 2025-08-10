import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";

type GoogleSignInButtonProps = {
  onPress: () => void;
  style?: object;
};

export default function GoogleSignInButton({ onPress, style }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/google-logo.png")} // ← Replace with the path to your google logo PNG
          style={styles.logo}
        />
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    width: "100%",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

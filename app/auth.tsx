import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import handleSignIn from "@/utils/auth/handleSignIn";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, SafeAreaView, Dimensions} from "react-native";
import {router} from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";

// Get screen dimensions for responsiveness
const { width } = Dimensions.get("window");
// Sample image width: 80% of screen, capped at 350px for giant devices
const imageWidth = Math.min(width * 0.8, 350);

export default function AuthScreen() {
  const params = useSearchParams();
  const error = params.get("error")
  // Use Async storage instead! TODO
  useEffect(() => {
    (async () => {
      try {
        console.log("On auth page")
        await getCurrentUser(); // throws if not signed in
        router.replace("/");
      } catch {
        // not signed in; stay on auth
      }
    })();
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          {/* Replace with your actual logo image source */}
          <Image
            source={require("../assets/images/elev8academy-logo.png")} // Add your own asset here!
            style={[styles.responsiveImage, { width: imageWidth, height: imageWidth }]}
            resizeMode="contain"
          />
          {error && <Text style={{ color: "red", fontWeight: "bold", marginBottom: 20 }}>{decodeURIComponent(error)}</Text>}
        <View style={styles.buttonContainer}>
          <GoogleSignInButton
            onPress={() => handleSignIn()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  responsiveImage: {
    marginBottom: 32,
    alignSelf: "center",
  },
  buttonContainer: {
    width: "90%",
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
  },
});
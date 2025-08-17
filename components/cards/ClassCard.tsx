import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { generateSession } from "@/utils/session/generateSession";
import { useRouter } from "expo-router";


type ClassCardProps = {
  level: string;
  subject: string;
  tutorEmail: string;
};

export default function ClassCard({ level, subject, tutorEmail }: ClassCardProps) {
  const route = useRouter();
  async function handleGenerate() {
    try {
        const generatedQR = await generateSession({ level, subject, tutorEmail });
        console.log(`Session generated for ${level} ${subject}`);

        let sessionId: string | undefined;
        if (
            typeof generatedQR === "object" &&
            generatedQR !== null &&
            "sessionId" in generatedQR
        ) {
        sessionId = (generatedQR as { sessionId: string }).sessionId;
        }
        route.push(`/qr?sessionId=${sessionId}`);
        } catch (error) {
        console.error("Error generating session:", error);
        }
    }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {level} {subject}
      </Text>
      <Button title="Generate Session" onPress={handleGenerate} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: "80%",
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.text}>
        {`Bienvenido 👋 Usá el menú para ir a "Escanear DNI"`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 48,
    backgroundColor: "#f9fafb",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  text: { fontSize: 16 },
});

import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = { label: string; onPress: () => void; disabled?: boolean };

export default function PrimaryButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      android_ripple={{ color: "#11182722" }}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  label: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.9 },
});

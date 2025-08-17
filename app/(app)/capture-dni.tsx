import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import PrimaryButton from "../../src/components/PrimaryButton";
import { uploadDniImages } from "../../src/api/upload";
import { useAuth } from "../../src/api/AuthContext";

export default function CaptureDniScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<"frente" | "dorso">("frente");
  const [frenteUri, setFrenteUri] = useState<string | null>(null);
  const [dorsoUri, setDorsoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  async function takePhoto() {
    try {
      // @ts-ignore - takePictureAsync está disponible en CameraView via ref
      const photo = await cameraRef.current?.takePictureAsync({
        skipProcessing: true,
        quality: 0.9,
      });
      if (!photo?.uri) return;
      if (step === "frente") {
        setFrenteUri(photo.uri);
        setStep("dorso");
      } else {
        setDorsoUri(photo.uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  }

  function reset() {
    setStep("frente");
    setFrenteUri(null);
    setDorsoUri(null);
  }

  async function send() {
    if (!frenteUri || !dorsoUri) return;
    try {
      setUploading(true);
      await uploadDniImages({
        token: token ?? "TOKEN_DEMO",
        frente: { uri: frenteUri },
        dorso: { uri: dorsoUri },
      });
      Alert.alert("Listo", "Imágenes enviadas correctamente");
      reset();
    } catch (e: any) {
      Alert.alert("Error subiendo imágenes", e?.message ?? "Error desconocido");
    } finally {
      setUploading(false);
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitamos permiso de cámara.</Text>
        <PrimaryButton label="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Capturar DNI ({step === "frente" ? "Frente" : "Dorso"})
      </Text>

      {!frenteUri || !dorsoUri ? (
        <View style={styles.cameraWrap}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
        </View>
      ) : (
        <View style={{ height: 320, gap: 12 }}>
          <Image source={{ uri: frenteUri }} style={styles.preview} />
          <Image source={{ uri: dorsoUri }} style={styles.preview} />
        </View>
      )}

      <View style={{ height: 12 }} />

      {!frenteUri || !dorsoUri ? (
        <PrimaryButton
          label={
            step === "frente" ? "Tomar foto del frente" : "Tomar foto del dorso"
          }
          onPress={takePhoto}
        />
      ) : uploading ? (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Subiendo...</Text>
        </View>
      ) : (
        <>
          <PrimaryButton label="Enviar imágenes" onPress={send} />
          <View style={{ height: 8 }} />
          <PrimaryButton label="Repetir" onPress={reset} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#f9fafb",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  cameraWrap: {
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  preview: { height: 150, borderRadius: 12, resizeMode: "cover" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
});

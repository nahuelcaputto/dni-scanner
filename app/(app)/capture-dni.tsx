import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import PrimaryButton from "../../src/components/PrimaryButton";
import { analyzeDniImages } from "../../src/api/upload";
import { useAuth } from "../../src/api/AuthContext";

type PhotoState = { uri: string; preview: string };

export default function CaptureDniScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<"frente" | "dorso">("frente");
  const [frente, setFrente] = useState<PhotoState | null>(null);
  const [dorso, setDorso] = useState<PhotoState | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  async function takePhoto() {
    try {
      // @ts-ignore - takePictureAsync existe en CameraView via ref
      const snap = await cameraRef.current?.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });
      if (!snap?.uri) return;

      const manipulated = await ImageManipulator.manipulateAsync(
        snap.uri,
        [{ resize: { width: 1600 } }],
        {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const preview = manipulated.base64
        ? `data:image/jpeg;base64,${manipulated.base64}`
        : manipulated.uri;

      const state: PhotoState = { uri: manipulated.uri, preview };

      if (step === "frente") {
        setFrente(state);
        setStep("dorso");
      } else {
        setDorso(state);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  }

  function reset() {
    setStep("frente");
    setFrente(null);
    setDorso(null);
  }

  async function send() {
    if (!frente || !dorso) return;
    try {
      setUploading(true);
      const result = await analyzeDniImages({
        frente: { uri: frente.uri },
        dorso: { uri: dorso.uri },
      });
      console.log("Analyze DNI result", result);
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

  const bothTaken = !!frente && !!dorso;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Capturar DNI ({step === "frente" ? "Frente" : "Dorso"})
      </Text>

      {!bothTaken ? (
        <View style={styles.cameraWrap}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
          {/* Overlay guía */}
          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.guideBox} />
            <Text style={styles.helper}>Alineá el DNI dentro del marco</Text>
          </View>
        </View>
      ) : (
        <View style={{ height: 320, gap: 12 }}>
          <Image source={{ uri: frente.preview }} style={styles.preview} />
          <Image source={{ uri: dorso.preview }} style={styles.preview} />
        </View>
      )}

      <View style={{ height: 12 }} />

      {!bothTaken ? (
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
  // Overlay centrado con marco
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  guideBox: {
    width: "85%",
    height: 190,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  helper: {
    position: "absolute",
    bottom: 16,
    color: "#fff",
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  preview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
});

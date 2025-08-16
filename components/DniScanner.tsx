import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { DniParsed, parseDniPdf417, validateParsed } from "../utils/parsers";

const DniScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const [step, setStep] = useState<"frente" | "dorso" | "final">("frente");
  const [frontPhotoUri, setFrontPhotoUri] = useState<string | null>(null);
  const [result, setResult] = useState<{
    datos: DniParsed;
    errores: string[];
  } | null>(null);
  const [scanned, setScanned] = useState(false);

  const camRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  const takeFrontPhoto = async () => {
    try {
      const photo = await camRef.current?.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      if (!photo?.uri) throw new Error("sin uri");
      setFrontPhotoUri(photo.uri);
      setStep("dorso");
    } catch {
      Alert.alert("Error", "No se pudo tomar la foto del frente.");
    }
  };

  const onScan = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = parseDniPdf417(data);
      const errores = validateParsed(parsed);
      setResult({ datos: parsed, errores });
      setStep("final");
    } catch {
      Alert.alert("Error", "No se pudo parsear el PDF417. Reintentá.");
      setScanned(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Sin permisos de cámara</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {step === "frente" && (
        <View style={{ flex: 1 }}>
          <CameraView ref={camRef} style={{ flex: 1 }} facing="back" />
          <View style={styles.footer}>
            <Button title="Tomar foto del frente" onPress={takeFrontPhoto} />
          </View>
        </View>
      )}

      {step === "dorso" && (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["pdf417"] }}
            onBarcodeScanned={onScan}
          />
          <View style={styles.footerRow}>
            <Button title="Reintentar" onPress={() => setScanned(false)} />
            <Text style={styles.tip}>
              Tip: buena luz y a 10–15 cm del código
            </Text>
          </View>
        </View>
      )}

      {step === "final" && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {frontPhotoUri && (
            <Image source={{ uri: frontPhotoUri }} style={styles.photo} />
          )}
          <Text style={styles.title}>JSON final</Text>
          <Text selectable style={styles.code}>
            {JSON.stringify(
              {
                fotoFrenteUri: frontPhotoUri,
                datos: result?.datos,
                errores: result?.errores,
              },
              null,
              2
            )}
          </Text>

          {result?.errores?.length ? (
            <>
              <Text style={[styles.title, { marginTop: 12 }]}>
                Errores de validación
              </Text>
              {result.errores.map((e, i) => (
                <Text key={i} style={{ color: "#b00020" }}>
                  • {e}
                </Text>
              ))}
            </>
          ) : null}

          <View style={{ height: 12 }} />
          <Button
            title="Repetir flujo"
            onPress={() => {
              setFrontPhotoUri(null);
              setResult(null);
              setScanned(false);
              setStep("frente");
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  footer: { position: "absolute", bottom: 24, left: 16, right: 16 },
  footerRow: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  tip: { opacity: 0.8 },
  title: { fontWeight: "600", fontSize: 16, marginBottom: 8 },
  code: { fontFamily: "monospace" },
  photo: {
    width: 260,
    height: 170,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center",
  },
});

export default DniScanner;

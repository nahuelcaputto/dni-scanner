import Constants from "expo-constants";
import { Platform } from "react-native";
const { API_URL } = Constants.expoConfig?.extra ?? {};

const FILE_FIELD = "file";

export async function analyzeDniImages({
  frente,
  dorso,
}: {
  frente: { uri: string; mime?: string };
  dorso: { uri: string; mime?: string };
}) {
  const [frontRes, backRes] = await Promise.all([
    analyzeOne(frente.uri, "front", frente.mime),
    analyzeOne(dorso.uri, "back", dorso.mime),
  ]);
  return { frente: frontRes, dorso: backRes } as const;
}

/** Un único POST multipart/form-data con el campo `file` */
async function analyzeOne(
  uri: string,
  side: "front" | "back",
  mime = "image/jpeg"
) {
  const form = new FormData();

  if (Platform.OS === "web") {
    // Web: Blob estándar
    const blob = await (await fetch(uri)).blob();
    form.append(FILE_FIELD, blob, `dni_${side}.jpg`);
  } else {
    form.append(FILE_FIELD, {
      uri,
      name: `dni_${side}.jpg`,
      type: mime,
    } as any);
  }

  const res = await fetch(`${API_URL}/momant-ai/analyze-dni?ocr=false`, {
    method: "POST",
    body: form,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Analyze failed ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text }; // por si devuelve texto plano
  }
}

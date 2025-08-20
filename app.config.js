import "dotenv/config";

export default {
  expo: {
    name: "dni-scanner",
    slug: "dni-scanner",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "Necesitamos acceso a la cámara para capturar el DNI.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: ["CAMERA"],
    },
    scheme: "dni-scanner",
    web: { favicon: "./assets/favicon.png" },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission:
            "Necesitamos acceso a la cámara para capturar el DNI.",
        },
      ],
      "expo-router",
      "expo-secure-store",
    ],
    extra: {
      API_URL: process.env.API_URL,
    },
    updates: { enabled: false },
  },
};

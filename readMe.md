# DNI Scanner App

Simple React Native app creada con Expo Router + TypeScript que permite capturar las imágenes de frente y dorso del DNI, visualizar una vista previa animada, y enviarlas a un endpoint de análisis.

## Características

- Pantalla de **Login** con opción de “Recordarme” (token almacenado en `SecureStore` en dispositivos móviles).
- Navegación con **Drawer**: Home y "Escanear DNI", más opción de "Cerrar sesión".
- Captura de imágenes con **Expo Camera**.
- Overlay guía para alinear el DNI y **animación 3D flip** con Reanimated al pasar del frente al dorso.
- Preview fiable usando `expo-image-manipulator` para evitar capturas negras.
- Upload mediante FormData (campo `file`) hacia el backend que devuelve la data analizada (ver capture-dni.tsx linea 103).
- Manejo de errores y feedback visual.

---

## Variables de Entorno

API_URL en archivo .env
Dentro del codigo se accede de la siguiente manera:

import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;
(ver auth.ts)

## Instalación y ejecución

```bash
git clone https://github.com/nahuelcaputto/dni-scanner.git
cd dni-scanner

npm install         # o yarn install
npx expo start          # Inicia Expo para desplegar en dispositivo/emulador
```

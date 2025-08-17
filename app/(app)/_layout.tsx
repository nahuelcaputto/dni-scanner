import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  return (
    <Drawer
      initialRouteName="home"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Drawer.Screen name="home" options={{ title: "Inicio" }} />
      <Drawer.Screen name="capture-dni" options={{ title: "Escanear DNI" }} />
    </Drawer>
  );
}

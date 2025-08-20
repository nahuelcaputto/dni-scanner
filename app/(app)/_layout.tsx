import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/api/AuthContext";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { signOut } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar sesión"
        onPress={async () => {
          await signOut();
          router.replace("/(auth)/login");
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <Drawer
      initialRouteName="home"
      screenOptions={{ headerTitleAlign: "center" }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="home" options={{ title: "Inicio" }} />
      <Drawer.Screen name="capture-dni" options={{ title: "Escanear DNI" }} />
    </Drawer>
  );
}

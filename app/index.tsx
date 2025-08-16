import React from "react";
import { View, Text } from "react-native";
import DniScanner from "../components/DniScanner";

const Index = () => {
  return (
    <>
      <DniScanner />
      <View>
        <Text>Hola mundo</Text>
      </View>
    </>
  );
};

export default Index;

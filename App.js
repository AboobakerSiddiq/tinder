import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import StatckNavigator from "./StatckNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatckNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

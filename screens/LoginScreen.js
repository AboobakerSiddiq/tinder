import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";

const LoginScreen = () => {
  const { signinwithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        resizeMode="cover"
        style={{ flex: 1 }}
        source={require("../assets/tinder.png")}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            top: 620,
            backgroundColor: "white",
            padding: 15,
            marginLeft: 70,
            marginRight: 70,
            borderRadius: 20,
          }}
          onPress={() => signinwithGoogle()}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {loading ? "loading..." : "Sign in & start swiping"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

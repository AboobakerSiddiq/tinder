import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { SimpleLineIcons } from "@expo/vector-icons";
import tw from "tailwind-rn";
import { db } from "../firebase";
import { doc, onSnapshot, collection } from "@firebase/firestore";

const ProfileScreen = () => {
  const { user, signout } = useAuth();
  const [profile, setProfile] = React.useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>User Profile</Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Image
          style={{ height: 100, width: 100, borderRadius: 50 }}
          source={{ uri: user.photoURL }}
        />
      </View>
      <View
        style={{
          marginLeft: 20,
          marginTop: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.header}>
          Name:<Text style={styles.text}> {user.displayName}</Text>
        </Text>
        <Text style={styles.header}>
          Email:<Text style={styles.text}> {user.email}</Text>
        </Text>
        <Text style={styles.header}>
          Email:<Text style={styles.text}> {profile.job}</Text>
        </Text>
        <Text style={styles.header}>
          Phone Number:
          <Text style={styles.text}>
            {profile.PhoneNumber === null ? "  NA" : profile.PhoneNumber}
          </Text>
        </Text>
        <Text style={styles.header}>
          Tinder Id:
          <Text style={styles.text}> {user.uid.slice(0, 7)}</Text>
        </Text>
      </View>
      <View style={{ marginTop: 80 }}>
        <TouchableOpacity
          onPress={signout}
          style={[
            tw("items-center justify-center rounded-full w-16 h-16 bg-red-200"),
            { alignItems: "center", justifyContent: "center", marginLeft: 185 },
          ]}
        >
          <SimpleLineIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "100",
    color: "red",
    fontStyle: "normal",
  },
  header: {
    color: "#242B2E",
    fontSize: 20,
    fontWeight: "100",
    paddingTop: 30,
  },
});

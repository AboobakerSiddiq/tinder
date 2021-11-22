import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = React.useState(null);
  const [job, setJob] = React.useState(null);
  const [age, setAge] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = React.useState(null);

  const incompleteForm = !image || !job || !age || !phoneNumber;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      PhoneNumber: phoneNumber,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifycontent: "center",
      }}
    >
      <Image
        style={{ height: 60, width: "100%" }}
        resizeMode="contain"
        source={require("../assets/tinderlogo2.png")}
      />
      <Text style={tw("text-2xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 1:The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter a Profile Pic URL"
        placeholderTextColor="gray"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 2:The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your Profession"
        placeholderTextColor="gray"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 3:Phone Number
      </Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your Age"
        placeholderTextColor="gray"
        // maxLength={2}
        keyboardType="numeric"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 4:Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your Age"
        placeholderTextColor="gray"
        maxLength={2}
        keyboardType="numeric"
      />
      <TouchableOpacity
        disabled={incompleteForm}
        onPress={updateUserProfile}
        style={[
          tw("w-64  p-3 rounded-xl absolute bottom-10"),
          incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalScreen;

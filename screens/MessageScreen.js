import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import tw from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
const MessageScreen = () => {
  const { user } = useAuth();
  var today = new Date(),
    time = today.getHours() + ":" + today.getMinutes();

  const { params } = useRoute();
  const { matchedUserInfo } = params;

  const [input, setInput] = useState();
  const [messages, setMessages] = useState([]);
  const { matchDetails } = params;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [matchDetails, db]
  );

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: time,
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput("");
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={-1}
            data={messages}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View
        style={tw(
          "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
        )}
      >
        <TextInput
          style={[tw("h-14 text-lg "), { color: "#FF5864" }]}
          placeholder="Send a message.."
          onChangeText={setInput}
          value={input}
          onSubmitEditing={sendMessage}
        />
        <Feather name="send" size={24} color="#FF5864" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;

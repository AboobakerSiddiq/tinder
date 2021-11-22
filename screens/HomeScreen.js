import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import tw from "tailwind-rn";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import { generateId } from "../lib/generateId";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

const DUMMY_DATA = [
  {
    id: "1",
    firstname: "Abu",
    secondname: " Siddiq",
    occupation: "VIP",
    image:
      "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_0.jpg",
    age: 35,
  },
  {
    id: "2",
    firstname: "Jane",
    secondname: " Doe",
    occupation: "VIP",

    image:
      "https://www.stockbasket.com/blog/wp-content/uploads/2019/12/Warren-Buffett-HD-Wallpaper-scaled.jpg",
    age: 35,
  },
  {
    id: "3",
    firstname: "Arshath",
    secondname: "Imran",
    occupation: "VIP",
    image:
      "https://images.unsplash.com/photo-1588221048587-7b6a941b9e1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    age: 35,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profiles, setProfiles] = React.useState([]);

  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
  }, []);

  const generatedId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    const loggedInProfiles = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          setDoc(doc(db, "matches", generatedId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfiles,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],

            timestamp: serverTimestamp(),
          }).then(
            navigation.navigate("Match", { loggedInProfiles, userSwiped })
          );
        } else {
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          paddingTop: 8,
          marginLeft: 5,
          marginRight: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Image
            source={{ uri: user.photoURL }}
            style={{
              height: 45,
              width: 45,
              borderRadius: 25,
              borderColor: "#FF5864",
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            source={require("../assets/tinderlogo.png")}
            style={{
              height: 45,
              width: 45,
              borderRadius: 25,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbox-outline" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* body */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={3}
          animateCardOpacity
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  paddingRight: 10,
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  paddingRight: 10,
                  color: "#4DED30",
                },
              },
            },
            bottom: {
              title: "SUPER-LIKE",
              style: {
                label: {
                  textAlign: "center",
                  paddingRight: 10,
                  color: "red",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  style={tw("absolute top-0 w-full h-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full h-20 flex-row justify-between items-center px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold py-1")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  // style={tw("h-20 w-full")}
                  // height={100}
                  // width={100}
                  style={{ height: 60, width: "100%" }}
                  resizeMode="contain"
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      {/* footer */}
      <View style={tw("flex flex-row justify-evenly py-6")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

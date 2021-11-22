import React, { createContext, useContext, useEffect, useState } from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChange,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { auth } from "../firebase";
import confi from "../confi.js";

const authContext = createContext({});

const config = {
  androidClientId: confi.ANDROID_KEY,
  iosClientId: confi.IOS_KEY,
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  console.log(confi.ANDROID_KEY);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    });
  }, []);

  const signinwithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === "success") {
          // console.log(logInResult);
          const { idToken, accessToken } = logInResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const signout = async () => {
    setLoading(true);
    await signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
    setUser(null);
  };

  const memoedValue = React.useMemo(
    () => ({
      error,
      user,
      loadingInitial,
      loading,
      signinwithGoogle,
      signout,
    }),
    [error, user, loading]
  );

  return (
    <authContext.Provider
      value={{ user, loading, error, signinwithGoogle, signout }}
    >
      {!loadingInitial && children}
    </authContext.Provider>
  );
};

export default function useAuth() {
  return useContext(authContext);
}

import React from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
export default function SignIn() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      //Signed In...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
}

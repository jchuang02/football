import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { deleteEmail } from "../actions";
import { getFollowsFromFirebase } from "../helpers/firebaseHelper";

export default function useSignInWithEmailLink() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const email = useSelector((state) => state.email);
  const followed = useSelector((state) => state.followed);

  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (isBrowser && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          dispatch(deleteEmail());
          getFollowsFromFirebase(followed, dispatch, auth.currentUser.uid);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.code);
        });
    }
  }, []);
}

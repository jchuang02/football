import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuth() {
  const [theUser, setTheUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTheUser(user);
      } else {
        setTheUser(null);
      }
    });
  });

  return theUser ? theUser.email : null;
}

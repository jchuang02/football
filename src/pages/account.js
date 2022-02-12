import React from "react";
import { getAuth, signOut } from "firebase/auth";
import Layout from "../components/layout";
import { Button } from "@mui/material";
import { Link, navigate } from "gatsby";
import { resetFollowed } from "../actions";
import { useDispatch } from "react-redux";

export default function Account() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(resetFollowed());
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Layout>
      <Button onClick={handleSignOut}>Sign Out</Button>
      <Link to="/personalize">I'm a Link</Link>
    </Layout>
  );
}

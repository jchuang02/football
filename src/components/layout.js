import React from "react";
import Nav from "./Nav";

export default function Layout({ children, user }) {
  return (
    <>
      <Nav user={user} />
      {children}
    </>
  );
}

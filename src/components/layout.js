import React from "react";
import Nav from "./Navigation/Nav";

export default function Layout({ children, user }) {
  return (
    <>
      <Nav user={user} />
      {children}
    </>
  );
}

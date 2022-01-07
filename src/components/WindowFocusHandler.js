import React, { useEffect } from "react";
import useForceUpdate from "../hooks/useForceUpdate";

export default function WindowFocusHandler() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    window.addEventListener("focus", forceUpdate);
    // Specify how to clean up after , this effect:
    return () => {
      window.removeEventListener("focus", forceUpdate);
    };
  });

  return <></>;
}

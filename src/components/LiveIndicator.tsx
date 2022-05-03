import { styled } from "@mui/system";
import { keyframes } from "@mui/styled-engine";
import React from "react";

const pulse = keyframes`
0% {
  opacity: 1;
}
50% {
  opacity: 0;
}
`;

const Live = styled("div")(() => ({
    height: "8px",
    width: "8px",
    backgroundColor: "#1BB55C",
    borderRadius: "50%",
    display: "inline-block",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    animation: `${pulse} 2s infinite ease`,
}));

export default function LiveIndicator() {
    return <Live />
}
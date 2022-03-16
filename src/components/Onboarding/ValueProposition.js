import React from "react";
import { Box, Typography } from "@mui/material";

const propositionStyle = {
  height: "100%",
  width: "20vw",
  bgcolor: "background.paper",
  border: "2px solid #2E3A59",
  p: 4,
  marginBottom: 4,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function ValueProposition({ proposition, icon }) {
  return (
    <Box sx={propositionStyle}>
      <Box sx={{ p: 1 }}>{icon}</Box>
      <Typography sx={{ fontSize: "16pt" }}>{proposition}</Typography>
    </Box>
  );
}

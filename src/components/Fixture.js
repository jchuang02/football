import React from "react";
import { Box, Typography } from "@mui/material";

export default function Fixture({ fixture }) {
  const fixtureStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vw",
    height: "80vh",
    bgcolor: "background.paper",
    border: "2px solid #2E3A59",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={fixtureStyle}>
      <Typography id="fixture-modal-title" variant="h6" component="h2">
        {fixture.fixture.id}
      </Typography>
      <Typography id="fixture-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  );
}

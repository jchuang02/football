import React from "react";
import { Box, Typography } from "@mui/material";

export default function PlayerPin({ player }) {
    const playerName = player.name.split(" ");
    return (
        <Box sx={{ display: "flex", flexFlow: "column", height: "100%", justifyContent: "center", alignItems: "center", flexBasis: "100%" }}>
            <Box sx={{ height: "1.5rem", width: "1.5rem", border: "2px solid black", borderRadius: "50px", textAlign: "center" }}>{player.pos}</Box>
            <Typography align="center">{playerName.length >= 3 ? `${playerName[playerName.length - 2]} ${playerName[playerName.length - 1]}` : playerName[playerName.length - 1]}</Typography>
        </Box>
    );
}
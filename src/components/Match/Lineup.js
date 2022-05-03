import React from "react"
import { Box, Container } from "@mui/material"
import PlayerPin from "./PlayerPin";

export default function Lineup({ lineup, direction }) {
    const players = lineup.startXI;

    const createSpaces = () => {
        let all = [];
        let column = [];
        let temp;
        players.forEach(({ player }) => {
            let grid = player.grid.split(":").map(grid => Number(grid));

            if (temp && temp !== grid[0]) {
                all.push(column);
                column = [];
            }
            temp = grid[0];
            column.push(<PlayerPin player={player} />);
        })

        if (column.length) {
            all.push(column);
        }
        return all;
    }

    let spaces = createSpaces();
    const fieldStyles = {
        height: "16rem",
        width: "20rem",
        display: "flex",
        flexFlow: `${direction === "left" ? 'row nowrap' : 'row-reverse nowrap'}`,
        border: "1px solid black",
        justifyContent: "space-evenly",
        borderRadius: "8px",
    }

    return (
        <Box sx={fieldStyles}>
            {spaces.map(column => {
                return (
                    <Box sx={{ display: "flex", flexFlow: "column", height: "100%", justifyContent: "center", alignItems: "center" }}>
                        {column.map(space => <Box sx={{ flexBasis: "100%" }}>{space}</Box>)}
                    </Box>
                );
            })}
        </Box>
    );
}
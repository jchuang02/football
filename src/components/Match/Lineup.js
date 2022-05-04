import React from "react"
import { Box } from "@mui/material"
import PlayerPin from "./PlayerPin";

export default function Lineup({ lineup, direction }) {
    const players = lineup.startXI;

    const createPlayerSpaces = () => {
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
            column.push(<PlayerPin player={player} key={player.id} />);
        })

        if (column.length) {
            all.push(column);
        }
        return all;
    }

    let playerSpaces = createPlayerSpaces();
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
            {playerSpaces.map((column, index) => {
                return (
                    <Box key={index} sx={{ display: "flex", flexFlow: "column", height: "100%", justifyContent: "center", alignItems: "center" }}>
                        {column.map((space, index) => <Box sx={{ flexBasis: "100%" }} key={index}>{space}</Box>)}
                    </Box>
                );
            })}
        </Box>
    );
}
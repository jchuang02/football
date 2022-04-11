import React from "react";
import {
  Box,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";

export default function League(props) {

  return (
    <TableContainer sx={{ maxHeight: "50vh" }}>
      <Table
        stickyHeader
        sx={{ borderCollapse: "separate" }}
        aria-label="league standings sticky table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">Team</TableCell>
            <TableCell align="center">GP</TableCell>
            <TableCell align="center">Points</TableCell>
            <TableCell align="center">W</TableCell>
            <TableCell align="center">D</TableCell>
            <TableCell align="center">L</TableCell>
            <TableCell align="center">GD</TableCell>
            <TableCell align="center">GF</TableCell>
            <TableCell align="center">GA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.standings.map((team) => {
            return (
              <TableRow key={team.team.id}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {team.rank}
                  <Box
                    sx={{
                      img: {
                        width: "40px",
                        height: "40px",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      },
                    }}
                  >
                    <img
                      src={team.team.logo}
                      alt={`${team.team.name} Logo`}
                    ></img>
                  </Box>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.team.name}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.played}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.points}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.win}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.draw}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.lose}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.goalsDiff}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.goals.for}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {team.all.goals.against}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

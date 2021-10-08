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

export default function League({ standings }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "solid 2px #E5E5E5",
        borderRadius: "8px",
        boxShadow: "none",
        marginBottom: "2rem",
        marginTop: "2rem",
      }}
    >
      <Table sx={{ borderCollapse: "separate" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="right">GP</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">W</TableCell>
            <TableCell align="right">D</TableCell>
            <TableCell align="right">L</TableCell>
            <TableCell align="right">GD</TableCell>
            <TableCell align="right">GF</TableCell>
            <TableCell align="right">GA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((team) => {
            return (
              <TableRow key={team.team.id}>
                <TableCell component="th" scope="row">
                  {team.rank}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  {team.team.name}
                  <Box
                    sx={{
                      img: {
                        width: "40px",
                        height: "40px",
                        marginLeft: "1rem",
                        marginRight: "1rem"
                      },
                    }}
                  >
                    <img
                      src={team.team.logo}
                      alt={`${team.team.name} Logo`}
                    ></img>
                  </Box>
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.all.played}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.points}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.all.win}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.all.draw}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.all.lose}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.goalsDiff}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {team.all.goals.for}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
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

import { Avatar, Container, Paper, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeamPlayers } from "../actions";

export default function Players() {
  const teamPlayers = useSelector((state) => state.teamPlayers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (teamPlayers.length === 0) {
      dispatch(fetchTeamPlayers(25, 2020, 4));
    }
  }, [dispatch, teamPlayers.length]);

  const useStyles = makeStyles({
    container: {
      height: "80vh",
      overflowY: "scroll",
      overflowX: "hidden",
    },
    textContainer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem",
    },
  });

  const classes = useStyles();

  const showPlayers = () => {
    return teamPlayers
      .sort((one, two) => {
        return (
          two.statistics[0].games.appearences -
          one.statistics[0].games.appearences
        );
      })
      .filter((player) => {
        return (
          player.statistics[0].games.appearences > 0 &&
          player.statistics[0].games.appearences !== null
        );
      })
      .map((player) => {
        return (
          <Container className={classes.textContainer} key={player.player.id}>
            <Avatar variant="rounded" src={player.player.photo}></Avatar>
            <Typography>{player.player.name}</Typography>
            <Typography>{`${player.statistics[0].games.appearences} Appearances`}</Typography>
          </Container>
        );
      });
  };
  return (
    <Container component={Paper} className={classes.container}>
      Players
      {showPlayers()}
    </Container>
  );
}

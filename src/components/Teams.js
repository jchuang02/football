import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Paper, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { fetchTeamStats } from "../actions";

export default function Standings() {
  const teamStats = useSelector((state) => state.teamStats);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(teamStats)) {
      dispatch(fetchTeamStats(25, 4, 2020));
    }
  }, [dispatch, teamStats]);

  const useStyles = makeStyles({
    container: {
      height: "80vh",
    },
    teamHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      "& img": {
        height: "5rem",
        width: "5rem",
      },
    },
  });

  const classes = useStyles();
  
  const showTeamStats = () => {
    if (!Array.isArray(teamStats)) {
      return (
        <Container component={Paper} className={classes.container}>
          <Container className={classes.teamHeader}>
            <Typography variant="h4" align="center">{teamStats.team.name}</Typography>
            <img
              src={teamStats.team.logo}
              alt={`${teamStats.team.name} Logo`}
            ></img>
          </Container>
          <Typography>{`Goals Scored: ${teamStats.goals.for.total.total}`}</Typography>
          <Typography>{`Goals Conceded: ${teamStats.goals.against.total.total}`}</Typography>
          <Typography>{`Clean Sheets: ${teamStats.clean_sheet.total}`}</Typography>
          <Typography>{`Average Goals Scored: ${teamStats.goals.for.average.total}`}</Typography>
        </Container>
      );
    } else {
      return <Typography>Wassup foo</Typography>;
    }
  };

  return showTeamStats();
}

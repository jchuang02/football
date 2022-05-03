import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MatchCard from "../MatchCard";
import { Container, Grid } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  main: {
    display: "flex",
  },
  column: {
    display: "flex",
    flexFlow: "column",
  },
}));

export default function Bracket() {
  const matches = useSelector((state) => state.matches);
  const dispatch = useDispatch();
  const fillerMatch = {
    match: {
      id: null,
      referee: null,
      timezone: null,
      date: null,
      timestamp: null,
      periods: {
        first: null,
        second: null,
      },
      venue: {
        id: null,
        name: null,
        city: null,
      },
      status: {
        long: null,
        short: null,
        elapsed: null,
      },
    },
    league: {
      id: null,
      name: null,
      country: null,
      logo: null,
      flag: null,
      season: null,
      round: null,
    },
    teams: {
      home: {
        id: null,
        name: null,
        logo: null,
        winner: null,
      },
      away: {
        id: null,
        name: null,
        logo: null,
        winner: null,
      },
    },
    goals: {
      home: null,
      away: null,
    },
  };

  return (
    <Container>
      <Grid container>
        <Grid container item xs={12} spacing={3}>
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <MatchCard match={fillerMatch} />

          <MatchCard match={fillerMatch} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <MatchCard match={fillerMatch} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
          <MatchCard match={fillerMatch} />
        </Grid>
      </Grid>
    </Container>
  );
}

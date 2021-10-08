import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FixtureCard from "./FixtureCard";
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
  const fixtures = useSelector((state) => state.fixtures);
  const dispatch = useDispatch();
  const fillerFixture = {
    fixture: {
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

  const playoffFixtures = fixtures.filter((fixture) => {
    return fixture.round === "8th Finals";
  });
  return (
    <Container>
      <Grid container>
        <Grid container item xs={12} spacing={3}>
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FixtureCard fixture={fillerFixture} />

          <FixtureCard fixture={fillerFixture} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FixtureCard fixture={fillerFixture} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
          <FixtureCard fixture={fillerFixture} />
        </Grid>
      </Grid>
    </Container>
  );
}

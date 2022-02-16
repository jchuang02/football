import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { deleteEmail } from "../actions";
import Layout from "../components/layout";
import { Box, Typography } from "@mui/material";
import Live from "../components/Matches/Live";
import Upcoming from "../components/Matches/Upcoming";
import Recent from "../components/Matches/Recent";
import {
  fixturesFinished,
  fixturesInProgress,
  fixturesUpcoming,
} from "../helpers/fixturesHelper";
import Standings from "../components/Standings";
import Selector from "../components/Selector";
import useSignInWithEmailLink from "../hooks/useSignInWithEmailLink";

export default function Home() {
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.leagues);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const selectorItems = followedLeagues
    .filter((league) => {
      return Object.keys(leagues).includes(String(league));
    })
    .map((league) => {
      return {
        id: leagues[league].leagueInfo.league.id,
        name: leagues[league].leagueInfo.league.name,
        logo: leagues[league].leagueInfo.league.logo,
        country: leagues[league].leagueInfo.country.name,
        flag: leagues[league].leagueInfo.country.flag,
      };
    });
  const [selected, setSelected] = useState(
    selectorItems[0] ? selectorItems[0].id : 0
  );

  const fixtures = useSelector((state) => {
    const teamFixtures = Object.values(state.teamFixtures).map((team) => {
      return team.fixtureInfo;
    });
    const leagueFixtures = Object.values(state.fixtures).map((league) => {
      return league.fixtureInfo;
    });

    let allFixtures = new Set();
    for (let i = 0; i < teamFixtures.length; i++) {
      fixturesUpcoming(teamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
      fixturesInProgress(teamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
      fixturesFinished(teamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
    }

    for (let i = 0; i < leagueFixtures.length; i++) {
      fixturesUpcoming(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
      fixturesInProgress(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
      fixturesFinished(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          allFixtures.add(fixture);
        });
    }

    return Array.from(allFixtures);
  });

  useSignInWithEmailLink();

  if (!followedLeagues.length > 0 && !followedTeams.length > 0) {
    return (
      <Layout>
        <Typography variant="h1">Welcome to dashboard.football</Typography>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Live fixtures={fixturesInProgress(fixtures ? fixtures : "")} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Recent fixtures={fixturesFinished(fixtures ? fixtures : "")} />
          <Upcoming fixtures={fixturesUpcoming(fixtures ? fixtures : "")} />
        </Box>
        {leagues ? (
          <>
            <Selector
              selected={selected}
              setSelected={setSelected}
              items={selectorItems}
            />
            <Standings selectedLeague={selected} />
          </>
        ) : (
          ""
        )}
      </Layout>
    );
  }
}

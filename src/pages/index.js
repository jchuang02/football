import React, { useState } from "react";
import { useSelector } from "react-redux";
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
import useGetData from "../hooks/useGetData";

export default function Home() {
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
  const { allFixtures } = useGetData();
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
          <Live
            fixtures={fixturesInProgress(allFixtures.length ? allFixtures : "")}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Recent
            fixtures={fixturesFinished(allFixtures.length ? allFixtures : "")}
          />
          <Upcoming
            fixtures={fixturesUpcoming(allFixtures.length ? allFixtures : "")}
          />
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

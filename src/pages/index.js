import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { deleteEmail } from "../actions";
import Layout from "../components/layout";
import { Box } from "@mui/material";
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

export default function Home() {
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.leagues);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const selectorItems = followedLeagues.map((league) => {
    return {
      id: leagues[league].leagueInfo.league.id,
      name: leagues[league].leagueInfo.league.name,
      logo: leagues[league].leagueInfo.league.logo,
      country: leagues[league].leagueInfo.country.name,
      flag: leagues[league].leagueInfo.country.flag,
    };
  });
  const [selected, setSelected] = useState(selectorItems[0].id || "");

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

  const auth = getAuth();

  const email = useSelector((state) => state.email);
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && isSignInWithEmailLink(auth, window.location.href)) {
    if (email.length > 0) {
      console.log(`Your email is : ${email}`);
    } else {
      console.log("Ask user for their email");
    }
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        console.log(result.user);
        dispatch(deleteEmail());
      })
      .catch((error) => {
        console.log(error);
        console.log(error.code);
      });
  }

  return (
    <Layout>
      <Live fixtures={fixturesInProgress(fixtures ? fixtures : "")} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Recent fixtures={fixturesFinished(fixtures ? fixtures : "")} />
        <Upcoming fixtures={fixturesUpcoming(fixtures ? fixtures : "")} />
      </Box>
      <Selector
        selected={selected}
        setSelected={setSelected}
        items={selectorItems}
      />
      <Standings selectedLeague={selected} />
    </Layout>
  );
}

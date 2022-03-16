import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import {
  Box,
  Container,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
  const [loading, setLoading] = useState(false);

  const leagues = useSelector((state) => state.leagues);
  const desktop = useMediaQuery("(min-width: 1600px");
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);

  const selectorItems = useMemo(() => {
    if (Object.values(leagues).length) {
      return Object.values(leagues).map(({ league }) => {
        return {
          id: league.league.id,
          name: league.league.name,
          logo: league.league.logo,
          country: league.country.name,
          flag: league.country.flag,
        };
      });
    } else {
      return [];
    }
  }, [leagues]);
  const [selected, setSelected] = useState(
    selectorItems[0] ? selectorItems[0].id : 0
  );

  useEffect(() => {
    setLoading(true);
    const pageLoading = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => {
      clearTimeout(pageLoading);
    };
  }, []);

  useEffect(() => {
    if (selectorItems.length) {
      setSelected(selectorItems[0].id);
    }
  }, [selectorItems]);

  const { allFixtures } = useGetData();

  useSignInWithEmailLink();

  if (!followedLeagues.length > 0 && !followedTeams.length > 0) {
    return (
      <Layout>
        <Container>
          <Typography variant="h1" align="center" sx={{ marginTop: "16rem" }}>
            Welcome to dashboard.football
          </Typography>
          <Typography variant="h5" align="center">
            To start, add the teams and competitions you'd like to follow above!
          </Typography>
        </Container>
      </Layout>
    );
  } else {
    return (
      <>
        <Layout>
          {!loading ? (
            <>
              <Live
                fixtures={fixturesInProgress(
                  allFixtures !== undefined ? allFixtures : ""
                )}
              />
              <Box
                sx={
                  desktop
                    ? {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }
                    : {}
                }
              >
                <Recent
                  fixtures={fixturesFinished(
                    allFixtures !== undefined
                      ? allFixtures.sort((fixture) => {
                          if (
                            followedTeams.includes(fixture.teams.home.id) ||
                            followedTeams.includes(fixture.teams.away.id)
                          ) {
                            return 1;
                          } else {
                            return undefined;
                          }
                        })
                      : ""
                  )}
                />
                <Upcoming
                  fixtures={fixturesUpcoming(
                    allFixtures !== undefined
                      ? allFixtures.length
                        ? fixturesUpcoming(allFixtures).sort((fixture) => {
                            if (
                              followedTeams.includes(fixture.teams.home.id) ||
                              followedTeams.includes(fixture.teams.away.id)
                            ) {
                              return 1;
                            } else {
                              return undefined;
                            }
                          })
                        : ""
                      : ""
                  )}
                />
              </Box>
              {Object.keys(leagues).length ? (
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
            </>
          ) : (
            <LinearProgress />
          )}
        </Layout>
      </>
    );
  }
}

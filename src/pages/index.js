import React, { lazy, Suspense, useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  fixturesFinished,
  fixturesInProgress,
  fixturesUpcoming,
} from "../helpers/fixturesHelper";
import useSignInWithEmailLink from "../hooks/useSignInWithEmailLink";
import useGetData from "../hooks/useGetData";

const Standings = lazy(() => import("../components/Standings/Standings"));
const Live = lazy(() => import("../components/Matches/Live"));
const Upcoming = lazy(() => import("../components/Matches/Upcoming"));
const Recent = lazy(() => import("../components/Matches/Recent"));
const Selector = lazy(() => import("../components/Selector"));

const renderLoader = () => (
  <Container>
    <CircularProgress />
  </Container>
);

export default function Home() {
  const leagues = useSelector((state) => state.leagues);
  const desktop = useMediaQuery("(min-width: 1600px");
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const allLeagues = useMemo(() => {
    return Object.values(leagues);
  }, [leagues]);

  const selectorItems = useMemo(() => {
    if (allLeagues.length) {
      return allLeagues.map(({ league }) => {
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
  }, [allLeagues]);
  const [selected, setSelected] = useState(
    selectorItems[0] ? selectorItems[0].id : 0
  );

  useEffect(() => {
    if (selectorItems.length) {
      setSelected(selectorItems[0].id);
    }
  }, [selectorItems]);

  const { allShownFixtures } = useGetData();

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
        <Suspense fallback={renderLoader()}>
          <Layout>
            <>
              <Live
                fixtures={fixturesInProgress(
                  allShownFixtures !== undefined ? allShownFixtures : ""
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
                    allShownFixtures !== undefined
                      ? allShownFixtures.sort((fixture) => {
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
                    allShownFixtures !== undefined
                      ? allShownFixtures.length
                        ? fixturesUpcoming(allShownFixtures).sort((fixture) => {
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
              {allLeagues.length ? (
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
            )
          </Layout>
        </Suspense>
      </>
    );
  }
}

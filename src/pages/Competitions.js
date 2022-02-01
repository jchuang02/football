import {
  Box,
  Container,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import Fixtures from "../components/Fixtures";
import Standings from "../components/Standings";
import { selectLeague } from "../actions";
import { useDispatch } from "react-redux";
import Layout from "../components/layout";

export default function Competitions() {
  const leagues = useSelector((state) => state.leagues);
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const dispatch = useDispatch();

  if (leagues) {
    return (
      <Layout>
        <Container sx={{ padding: "1rem" }}>
          {!selectedLeague ? (
            <Typography
              variant="h2"
              sx={{ padding: "4rem", textAlign: "center" }}
            >
              Welcome to Footdash
            </Typography>
          ) : (
            ""
          )}

          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              textAlign: "center",
              margin: "auto",
              marginTop: "4rem",
            }}
          >
            {selectedLeague ? (
              <Box
                sx={{
                  img: {
                    height: "160px",
                    widght: "160px",
                    padding: "2rem",
                  },
                }}
              >
                <img
                  alt={
                    leagues[selectedLeague].leagueInfo.league.name
                      ? `${leagues[selectedLeague].leagueInfo.league.name} logo`
                      : "no image found"
                  }
                  src={leagues[selectedLeague].leagueInfo.league.logo}
                ></img>
              </Box>
            ) : (
              ""
            )}
            <FormControl
              sx={{
                minWidth: 400,
              }}
            >
              <Select
                id="competitions-selector"
                value={selectedLeague}
                displayEmpty
                onChange={(e) => {
                  dispatch(selectLeague(e.target.value));
                }}
                input={<OutlinedInput />}
                renderValue={() => {
                  if (selectedLeague.length === 0) {
                    return <em>Choose Competition</em>;
                  }

                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        img: {
                          height: "48px",
                          width: "48px",
                          paddingLeft: "2rem",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "24pt",
                          fontWeight: "500",
                          color: "#2E3A59",
                        }}
                      >
                        {leagues[selectedLeague].leagueInfo.league.name}
                      </Typography>
                      {leagues[selectedLeague].leagueInfo.country.flag ? (
                        <img
                          src={leagues[selectedLeague].leagueInfo.country.flag}
                          alt={`${leagues[selectedLeague].leagueInfo.country.flag} flag`}
                        ></img>
                      ) : (
                        ""
                      )}
                    </Box>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <em>Select Competition</em>
                </MenuItem>
                {Object.values(leagues).map((league) => {
                  return (
                    <MenuItem
                      value={league.leagueInfo.league.id}
                      key={league.leagueInfo.league.id}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {league.leagueInfo.league.name}
                      {league.leagueInfo.country.flag ? (
                        <Box
                          sx={{
                            img: {
                              height: "24px",
                              width: "24px",
                              marginLeft: "0.5rem",
                            },
                          }}
                        >
                          <img
                            src={league.leagueInfo.country.flag}
                            alt={`${league.leagueInfo.country.flag} flag`}
                          ></img>
                        </Box>
                      ) : (
                        ""
                      )}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Container>
          {selectedLeague ? (
            <>
              <Fixtures />
              <Standings />
            </>
          ) : (
            ""
          )}
        </Container>
      </Layout>
    );
  } else {
    return <CircularProgress />;
  }
}

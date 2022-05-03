import React from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MatchCard from "../Match/MatchCard";
import { separateMatches } from "../../helpers/matchesHelper";
import Matches from "./Matches";

export default function Recent({ matches }) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  if (matches) {
    const sortedMatches = matches.sort((matchOne, matchTwo) => {
      return matchTwo.fixture.timestamp - matchOne.fixture.timestamp;
    });

    const matchCards = separateMatches(
      sortedMatches,
      desktop ? 2 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1
    );
    return (
      <Box
        sx={
          desktop
            ? {
              width: "45%",
              marginLeft: "0.5rem",
              textAlign: "right",
            }
            : {
              display: "flex",
              flexDirection: "column",
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
            }
        }
      >
        <Typography variant="h5" align={"center"}>
          Recent
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {sortedMatches.length > 0 ? (
            <Matches
              matches={sortedMatches}
              groupedBy={desktop ? 2 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1}
              axis={desktop ? "x-reverse" : "x"}
              direction={desktop ? "rtl" : "ltr"}
            >
              {matchCards.map((section, index) => {
                return (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    {section
                      .sort((matchOne, matchTwo) => {
                        return (
                          matchOne.fixture.timestamp -
                          matchTwo.fixture.timestamp
                        );
                      })
                      .map((match) => {
                        return (
                          <MatchCard
                            match={match}
                            key={match.fixture.id}
                          />
                        );
                      })}
                  </Box>
                );
              })}
            </Matches>
          ) : (
            <Container>
              <Typography>No previous matches available</Typography>
            </Container>
          )}
        </Box>
      </Box>
    );
  } else {
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }
}

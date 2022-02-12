import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FixtureCard from "../FixtureCard";
import { separateFixtures } from "../../helpers/fixturesHelper";
import Matches from "./Matches";

export default function Recent({ fixtures }) {
  if (fixtures) {
    const sortedFixtures = fixtures.sort((fixtureOne, fixtureTwo) => {
      return fixtureTwo.fixture.timestamp - fixtureOne.fixture.timestamp;
    });

    const fixtureCards = separateFixtures(sortedFixtures);
    return (
      <Box
        sx={{
          width: "45%",
          marginLeft: "0.5rem",
          textAlign: "right",
        }}
      >
        <Typography variant="h5">Past</Typography>
        <Box
          sx={{
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {sortedFixtures.length > 0 ? (
            <Matches fixtures={sortedFixtures} axis="x-reverse" direction="rtl">
              {fixtureCards.map((section, index) => {
                return (
                  <Box key={index} sx={{ display: "flex" }}>
                    {section
                      .sort((fixtureOne, fixtureTwo) => {
                        return (
                          fixtureOne.fixture.timestamp -
                          fixtureTwo.fixture.timestamp
                        );
                      })
                      .map((fixture) => {
                        return (
                          <FixtureCard
                            fixture={fixture}
                            key={fixture.fixture.id}
                          />
                        );
                      })}
                  </Box>
                );
              })}
            </Matches>
          ) : (
            <Typography>No previous matches available</Typography>
          )}
        </Box>
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
}

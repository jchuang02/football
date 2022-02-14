import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FixtureCard from "../FixtureCard";
import { separateFixtures } from "../../helpers/fixturesHelper";
import Matches from "./Matches";

export default function Live({ fixtures }) {
  if (fixtures) {
    const fixtureCards = separateFixtures(fixtures);
    return (
      <Box sx={!fixtures.length > 0 ? { display: "none" } : {}}>
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {fixtures.length > 0 ? (
            <Matches fixtures={fixtures}>
              {fixtureCards.map((section, index) => {
                return (
                  <Box key={index} sx={{ display: "flex" }}>
                    {section.map((fixture) => {
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
            <Typography>No Upcoming Matches</Typography>
          )}
        </Box>
        <Typography variant="h5" align="center">
          Live
        </Typography>
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
}

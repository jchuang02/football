import React from "react";
import {
  fixtureInProgress,
  fixtureFinished,
} from "../../helpers/fixtureStatusHelper";
import { separateFixtures } from "../../helpers/fixturesHelper";
import { Box, CircularProgress, Typography } from "@mui/material";
import FixtureCard from "../FixtureCard";
import Matches from "./Matches";

export default function Upcoming({ fixtures }) {
  if (fixtures) {
    const fixtureCards = separateFixtures(fixtures);
    return (
      <Box sx={{ width: "45%", marginRight: "0.5rem" }}>
        <Typography variant="h5">Upcoming</Typography>
        <Box
          sx={{
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {fixtures.length > 0 ? (
            <Matches fixtures={fixtures} direction="ltr">
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
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
}

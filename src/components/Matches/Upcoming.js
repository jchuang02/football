import React from "react";
import { separateFixtures } from "../../helpers/fixturesHelper";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FixtureCard from "../FixtureCard";
import Matches from "./Matches";

export default function Upcoming({ fixtures }) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  if (fixtures) {
    const fixtureCards = separateFixtures(
      fixtures,
      desktop ? 2 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1
    );
    return (
      <Box
        sx={
          desktop
            ? { width: "45%", marginRight: "0.5rem" }
            : {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                textAlign: "center",
              }
        }
      >
        <Typography variant="h5">Upcoming</Typography>
        <Box
          sx={{
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {fixtures.length > 0 ? (
            <Matches
              fixtures={fixtures}
              groupedBy={desktop ? 2 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1}
              direction="ltr"
            >
              {fixtureCards.map((section, index) => {
                return (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
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
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }
}

import React from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FixtureCard from "../FixtureCard";
import { separateFixtures } from "../../helpers/fixturesHelper";
import Matches from "./Matches";

export default function Live({ fixtures }) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  if (fixtures) {
    const fixtureCards = separateFixtures(
      fixtures,
      desktop ? 4 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1
    );
    return (
      <Box
        sx={
          !fixtures.length > 0
            ? { display: "none" }
            : {
                display: "flex",
                textAlign: "center",
                overflowX: "auto",
                flexFlow: "column nowrap",
                justifyContent: "space-evenly",
              }
        }
      >
        <Typography variant="h5" align="center">
          Live
        </Typography>
        {fixtures.length > 0 ? (
          <Matches
            fixtures={fixtures}
            groupedBy={desktop ? 4 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1}
          >
            {fixtureCards.map((section, index) => {
              return (
                <Box
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {section.map((fixture) => {
                    return (
                      <FixtureCard fixture={fixture} key={fixture.fixture.id} />
                    );
                  })}
                </Box>
              );
            })}
          </Matches>
        ) : (
          <Container>
            <Typography>No Upcoming Matches</Typography>
          </Container>
        )}
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

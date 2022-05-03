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

export default function Live({ matches }) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  if (matches) {
    const matchCards = separateMatches(
      matches,
      desktop ? 4 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1
    );
    return (
      <Box
        sx={
          !matches.length > 0
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
        {matches.length > 0 ? (
          <Matches
            matches={matches}
            groupedBy={desktop ? 4 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1}
          >
            {matchCards.map((section, index) => {
              return (
                <Box
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {section.map((match) => {
                    return (
                      <MatchCard match={match} key={match.fixture.id} />
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

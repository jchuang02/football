import React from "react";
import { separateMatches } from "../../helpers/matchesHelper";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MatchCard from "../Match/MatchCard";
import Matches from "./Matches";

export default function Upcoming({ matches }) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  if (matches) {
    const matchCards = separateMatches(
      matches,
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
        <Typography variant="h5" align={"center"}>
          Upcoming
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            overflowX: "auto",
          }}
        >
          {matches.length > 0 ? (
            <Matches
              matches={matches}
              groupedBy={desktop ? 2 : laptop ? 4 : tablet ? 3 : phone ? 2 : 1}
              direction="ltr"
            >
              {matchCards.map((section, index) => {
                return (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    {section.map((match) => {
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
              <Typography>No Upcoming Matches</Typography>
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

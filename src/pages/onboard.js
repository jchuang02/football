import React from "react";
import MyForm from "../components/Onboarding/MyForm";
import Layout from "../components/layout";
import ValueProposition from "../components/Onboarding/ValueProposition";
import { Container } from "@mui/material";
import { Box } from "@mui/material";
import { Trophy, StatsSquareUp, AntennaSignal } from "iconoir-react";
import theme from "../components/MaterialUI/Theme";

const style = {
  height: "40vh",
  width: "70vw",
  display: "flex",
  bgcolor: "background.paper",
  border: "4px solid #2E3A59",
  p: 4,
  marginBottom: 2,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "16px",
};

export default function Onboard() {
  return (
    <>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={style}>
            <ValueProposition
              proposition="Follow your favourite leagues and teams in one convenient place"
              icon={
                <Trophy
                  height={48}
                  width={48}
                  strokeWidth={2}
                  color={theme.palette.primary.main}
                />
              }
            />
            <ValueProposition
              proposition="Get live updates for all the games you follow"
              icon={
                <AntennaSignal
                  height={48}
                  width={48}
                  strokeWidth={2}
                  color={theme.palette.primary.main}
                />
              }
            />
            <ValueProposition
              proposition="With in depth statistics of individual matches"
              icon={
                <StatsSquareUp
                  height={48}
                  width={48}
                  strokeWidth={2}
                  color={theme.palette.primary.main}
                />
              }
            />
          </Box>
          <MyForm />
        </Container>
      </Layout>
    </>
  );
}

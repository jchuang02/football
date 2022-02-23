import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  Box,
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  styled,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Layout from "../components/layout";
import SearchInput from "../components/SearchInput";
import { Trophy, Group } from "iconoir-react";
import { searchTeams, searchLeagues, searchReset } from "../actions/search";
import { useSelector, useDispatch } from "react-redux";
import Option from "../components/Onboarding/Option";
import { navigate } from "gatsby";
import { addFollowsToFirebase } from "../helpers/firebaseHelper";
import useSignInWithEmailLink from "../hooks/useSignInWithEmailLink";

const steps = ["Choose Teams", "Choose Competitions and Leagues"];
const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "60vh",
  width: "70vw",
  bgcolor: "background.paper",
  border: "4px solid #2E3A59",
  p: 4,
  marginTop: "10rem",
  marginBottom: 4,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "16px",
};

export default function Personalize() {
  const [activeStep, setActiveStep] = useState(0);
  const [term, setTerm] = useState("");
  const followed = useSelector((state) => state.followed);
  const results = useSelector((state) => state.search.results);
  const loading = useSelector((state) => state.search.loading);

  const dispatch = useDispatch();
  const auth = getAuth();
  useSignInWithEmailLink();

  useEffect(() => {
    setTerm("");
    dispatch(searchReset());
  }, [activeStep, dispatch]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (!activeStep && term.length >= 3) {
        dispatch(searchTeams(term));
      } else if (activeStep && term.length >= 3) {
        dispatch(searchLeagues(term));
      }
    }, 500);
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [activeStep, dispatch, term]);

  const handleInput = (e) => {
    setTerm(e.target.value);
  };

  const handleNext = () => {
    setTerm("");
    dispatch(searchReset());
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setTerm("");
    dispatch(searchReset());
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConfirm = () => {
    setTerm("");
    dispatch(searchReset());
    if (auth.currentUser) {
      addFollowsToFirebase(followed, auth.currentUser.uid);
    }
    navigate("/");
  };

  const Connector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.info.main,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.info.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  return (
    <Layout>
      <Box sx={style}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<Connector />}
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            height: "25%",
            width: "50%",
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <SearchInput
          handleInput={handleInput}
          term={term}
          type={activeStep ? "league" : "team"}
        />
        <Box
          sx={
            term.length >= 3
              ? !loading
                ? {
                    border: "4px solid #2E3A59",
                    borderRadius: "8px",
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    display: "flex",
                    flexFlow: "row wrap",
                    boxSizing: "border-box",
                    alignItems: "flex-start",
                  }
                : {
                    border: "4px solid #2E3A59",
                    borderRadius: "8px",
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    display: "flex",
                    justifyContent: "center",
                    flexFlow: "row wrap",
                    boxSizing: "border-box",
                    alignItems: "center",
                  }
              : {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }
          }
        >
          {term.length >= 3 ? (
            !loading ? (
              results.map((result) => {
                return (
                  <Option
                    step={activeStep}
                    result={result}
                    key={result.team ? result.team.id : result.league.id}
                  />
                );
              })
            ) : (
              <CircularProgress />
            )
          ) : (
            <Box
              sx={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {activeStep ? (
                <Trophy color={"grey"} width={"64px"} height={"64px"} />
              ) : (
                <Group color={"grey"} width={"64px"} height={"64px"} />
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? handleConfirm : handleNext
            }
            sx={{ mt: 1, mr: 1 }}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button>
        </div>
      </Box>
    </Layout>
  );
}

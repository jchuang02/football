import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  InputBase,
  Step,
  StepLabel,
  Stepper,
  IconButton,
  Typography,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Layout from "../components/layout";
import { Search, Trophy, Group } from "iconoir-react";
import {
  searchTeams,
  searchLeagues,
  searchReset,
  setTerm,
  resetTerm,
} from "../actions";
import { useSelector, useDispatch } from "react-redux";
import theme from "../components/MaterialUI/Theme";
import Option from "../components/Onboarding/Option";
import { navigate } from "gatsby";

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
  const term = useSelector((state) => state.term);
  const results = useSelector((state) => state.search);
  const followed = useSelector((state) => state.followed);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetTerm());
    dispatch(searchReset());
  }, [activeStep, dispatch]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (!activeStep && term.length >= 3) {
        console.log("searching Teams");
        dispatch(searchTeams(term));
      } else if (activeStep && term.length >= 3) {
        console.log("searching Competitions");
        dispatch(searchLeagues(term));
      }
    }, 500);
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [activeStep, dispatch, term]);

  const handleInput = (e) => {
    dispatch(setTerm(e.target.value));
  };

  const handleNext = () => {
    dispatch(resetTerm());
    dispatch(searchReset());
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    dispatch(resetTerm());
    dispatch(searchReset());
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConfirm = () => {
    dispatch(resetTerm());
    dispatch(searchReset());
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
        <Box
          sx={{
            border: "4px solid #2E3A59",
            p: 1,
            m: 1,
            borderRadius: "16px",
            width: "50%",
          }}
        >
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={
              activeStep === steps.length - 1
                ? "Search Competitions"
                : "Search Teams"
            }
            inputProps={{
              "aria-label":
                activeStep === steps.length - 1
                  ? "Search Competitions"
                  : "Search Teams",
            }}
            autoFocus={true}
            onChange={handleInput}
            value={term}
          />
        </Box>
        <Box
          sx={
            results
              ? {
                  border: "4px solid #2E3A59",
                  borderRadius: "16px",
                  width: "100%",
                  height: "100%",
                  overflowY: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  boxSizing: "border-box",
                }
              : {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }
          }
        >
          {results.length > 0 ? (
            results.map((result) => {
              return <Option step={activeStep} result={result} />;
            })
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

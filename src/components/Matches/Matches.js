import { Box, MobileStepper, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export default function Matches({ fixtures, children, axis = "x", direction }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Math.ceil(fixtures.length / 2);
  const styles = {
    root: {
      // Simulates a global right-to-left direction.
      direction: direction,
    },
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const showFixtures = () => {
    return (
      <Box sx={{ ...styles.root, marginRight: "1rem", marginLeft: "1rem" }}>
        <SwipeableViews
          axis={axis}
          index={activeStep}
          children={children}
        ></SwipeableViews>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              {direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </Button>
          }
        />
      </Box>
    );
  };
  return showFixtures();
}

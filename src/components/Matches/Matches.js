import { Box, MobileStepper, Button, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export default function Matches({
  fixtures,
  groupedBy = 2,
  children,
  axis = "x",
  direction,
}) {
  const desktop = useMediaQuery("(min-width: 1600px");
  const laptop = useMediaQuery("(min-width: 1400px");
  const tablet = useMediaQuery("(min-width: 1050px");
  const phone = useMediaQuery("(min-width: 700px");

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Math.ceil(fixtures.length / groupedBy);

  useEffect(() => {
    if (activeStep > maxSteps) {
      setActiveStep(maxSteps - 1);
    }
  }, [activeStep, maxSteps]);
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

  const handleSwitch = (index) => {
    if (Number.isInteger(index)) {
      setActiveStep(index);
    }
  };

  const showFixtures = () => {
    return (
      <Box
        sx={{
          ...styles.root,
          marginRight: "1rem",
          marginLeft: "1rem",
        }}
      >
        <SwipeableViews
          axis={axis}
          index={activeStep}
          children={children}
          onSwitching={(index) => {
            handleSwitch(index);
          }}
          enableMouseEvents
        ></SwipeableViews>
        <MobileStepper
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
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

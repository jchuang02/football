import React from "react";
import { Box, Container } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  containerRoot: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    margin: "32px",
  },
  typographyRoot:   {
      marginRight: "32px",
  }
}));

export default function Legend() {
  const classes = useStyles();
  const keys = [
    { color: "#1BB55C", label: "Round of 16 Qualification" },
    { color: "#FFBB12", label: "Third Place Team Group" },
    { color: "#E74C3C", label: "Failed to Qualify" },
  ];
  const Key = ({color}) => {
    return <Box width={32} height={32} bgcolor={color} mr={1}></Box>;
  };

  return (
    <Container className={classes.containerRoot}>
      {keys.map((key) => {
        return (
          <>
            <Key color={key.color} />
            <Typography className={classes.typographyRoot}>{key.label}</Typography>
          </>
        );
      })}
    </Container>
  );
}

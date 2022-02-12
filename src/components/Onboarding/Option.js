import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import {
  addFaveTeam,
  addFaveLeague,
  deleteFaveTeam,
  deleteFaveLeague,
} from "../../actions";

export default function Option({ step, result }) {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const followed = useSelector((state) => state.followed);
  const handleChange = () => {
    console.log("====================================");
    console.log(result);
    console.log("====================================");
    setChecked(!checked);
    if (!step && checked) {
      dispatch(deleteFaveTeam(result.team.id));
    } else if (!step && !checked) {
      dispatch(addFaveTeam(result.team.id));
    } else if (step && checked) {
      dispatch(deleteFaveLeague(result.league.id));
    } else if (step && !checked) {
      dispatch(addFaveLeague(result.league.id));
    }
  };

  const checkedBox = {
    border: "4px solid #2E3A59",
    m: "1%",
    p: 2,
    borderRadius: "16px",
    width: "23%",
    flexBasis: "23%",
    textAlign: "center",
    background: "url('images/greenCheck.png')",
    backgroundColor: "rgba(0,0,0,0.2);",
    "&:hover": {
      cursor: "pointer",
    },
  };

  const uncheckedBox = {
    border: "4px solid #2E3A59",
    m: "1%",
    p: 2,
    borderRadius: "16px",
    width: "23%",
    flexBasis: "23%",
    textAlign: "center",
    "&:hover": {
      cursor: "pointer",
    },
  };
  return (
    <Box onClick={handleChange} sx={checked ? checkedBox : uncheckedBox}>
      <img
        src={step ? result.league.logo : result.team.logo}
        alt={step ? result.league.name : result.team.name}
        style={{ height: "80px", width: "80px" }}
      ></img>
      <Typography>{step ? result.league.name : result.team.name}</Typography>
    </Box>
  );
}

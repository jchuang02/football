import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Checkbox, Typography } from "@mui/material";
import {
  addFaveTeam,
  addFaveLeague,
  deleteFaveTeam,
  deleteFaveLeague,
} from "../../actions/favorites";

export default function Option({ step, result }) {
  const followed = useSelector((state) => state.followed);
  const [checked, setChecked] = useState(
    followed.teams.includes(result.team ? result.team.id : 0) ||
      followed.leagues.includes(result.league ? result.league.id : 0)
  );

  const dispatch = useDispatch();
  const handleChange = () => {
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
    borderRadius: "16px",
    m: 1,
    p: 1,
    textAlign: "center",
    background: "url('../../images/source_icons_check.svg')",
    backgroundColor: "rgba(0,0,0,0.2);",
    "&:hover": {
      cursor: "pointer",
    },
  };

  const contentBox = {
    display: "flex",
    flex: "0  1 25%",
    flexFlow: "column nowrap",
    marginBottom: 4,
  };

  const uncheckedBox = {
    border: "4px solid #2E3A59",
    borderRadius: "16px",
    m: 1,
    p: 1,
    textAlign: "center",
    "&:hover": {
      cursor: "pointer",
    },
  };

  const label = { inputProps: { "aria-label": "Checkbox option" } };

  return (
    <Box onClick={handleChange} sx={contentBox}>
      <Box sx={checked ? checkedBox : uncheckedBox}>
        <img
          src={step ? result.league.logo : result.team.logo}
          alt={step ? result.league.name : result.team.name}
          style={{ height: "80px", width: "80px" }}
        ></img>
        <Typography>
          {step ? `${result.league.name}, ` : `${result.team.name}, `}
        </Typography>
        <Typography>
          {step ? `${result.country.name}` : ` ${result.team.country}`}
        </Typography>
      </Box>
      <Checkbox {...label} checked={checked} disableRipple />
    </Box>
  );
}

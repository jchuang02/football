import React from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import { Search } from "iconoir-react";

const SEARCH_TYPES = {
  team: "Search Teams",
  league: "Search Competitions",
};

export default function SearchInput({ handleInput, term, type }) {
  return (
    <Box
      sx={{
        border: "4px solid #2E3A59",
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
        placeholder={SEARCH_TYPES[type]}
        inputProps={{
          "aria-label": SEARCH_TYPES[type],
        }}
        autoFocus={true}
        onChange={handleInput}
        value={term}
      />
    </Box>
  );
}

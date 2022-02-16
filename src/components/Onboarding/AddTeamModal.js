import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { searchTeams, searchReset } from "../../actions";
import SearchInput from "../SearchInput";
import { AddSquare, Group } from "iconoir-react";
import theme from "../MaterialUI/Theme";
import Option from "./Option";
import { addFollowsToFirebase } from "../../helpers/firebaseHelper";
import { getAuth } from "firebase/auth";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "70vh",
  width: "70vw",
  bgcolor: "background.paper",
  border: "4px solid #2E3A59",
  borderRadius: "16px",
  boxShadow: 0,
  p: 4,
  textAlign: "center",
  marginLeft: "auto",
  marginRight: "auto",
};

export default function AddTeamModal() {
  const followed = useSelector((state) => state.followed);
  const results = useSelector((state) => state.search);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const auth = getAuth();
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInput = (e) => {
    setTerm(e.target.value);
  };

  useEffect(() => {
    setTerm("");
    dispatch(searchReset());
  }, [open, dispatch]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (term.length >= 3) {
        dispatch(searchTeams(term));
      }
    }, 500);
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [dispatch, term]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <AddSquare
          color={theme.palette.primary.main}
          width={"32px"}
          height={"32px"}
        />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-team-modal-title"
        aria-describedby="add-team-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-team-modal-title" variant="h6" component="h2">
            Add a Team to Follow
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            The team's matches and standings will be available on the home page.
          </Typography>
          <SearchInput handleInput={handleInput} term={term} type={"team"} />
          <Box
            sx={
              results
                ? {
                    border: "4px solid #2E3A59",
                    borderRadius: "8px",
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
                return (
                  <Option
                    step={0}
                    result={result}
                    key={result.team ? result.team.id : result.league.id}
                  />
                );
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
                <Group color={"grey"} width={"64px"} height={"64px"} />
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={
              auth.currentUser
                ? () => {
                    addFollowsToFirebase(followed, auth.currentUser.uid);
                    handleClose();
                  }
                : handleClose
            }
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </>
  );
}

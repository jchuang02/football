import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { searchLeagues, searchReset } from "../../actions";
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

export default function PersonalizationModal() {
  const followed = useSelector((state) => state.followed);
  const results = useSelector((state) => state.search.results);
  const loading = useSelector((state) => state.search.loading);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInput = (e) => {
    setTerm(e.target.value);
  };
  const auth = getAuth();

  useEffect(() => {
    setTerm("");
    dispatch(searchReset());
  }, [open, dispatch]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (term.length >= 3) {
        dispatch(searchLeagues(term));
      } else {
        dispatch(searchReset());
      }
    }, 500);
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [dispatch, term]);

  return (
    <>
      <Box
        sx={
          followed.leagues.length > 0
            ? {}
            : hover
            ? {
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                "&:hover": {
                  cursor: "pointer",
                },
                width: "100%",
              }
            : {
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }
        }
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false);
        }}
        onClick={handleOpen}
      >
        {!followed.leagues.length > 0 ? (
          <Typography variant="h4" sx={{ fontWeight: 500, marginRight: 2 }}>
            Add Competition
          </Typography>
        ) : (
          ""
        )}
        <AddSquare
          color={theme.palette.primary.main}
          width={"32px"}
          height={"32px"}
          strokeWidth={hover ? 4 : 2}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-team-modal-title"
        aria-describedby="add-team-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-team-modal-title" variant="h6" component="h2">
            Add a League to Follow
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            The league's matches and standings will be available on the home
            page.
          </Typography>
          <SearchInput handleInput={handleInput} term={term} type={"league"} />
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
                      step={1}
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
                <Group color={"grey"} width={"64px"} height={"64px"} />
              </Box>
            )}
          </Box>
          <Button
            sx={{ marginTop: 4 }}
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

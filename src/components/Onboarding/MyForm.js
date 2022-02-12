import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { ProfileCircled } from "iconoir-react";
import { TextField } from "mui-rff";
import { Form } from "react-final-form";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { setEmail } from "../../actions";
import { useDispatch } from "react-redux";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "http://localhost:8000/",
  handleCodeInApp: true,
};

const style = {
  width: "40vw",
  bgcolor: "background.paper",
  border: "4px solid #2E3A59",
  p: 4,
  marginTop: 4,
  marginBottom: 4,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "16px",
};

export default function MyForm() {
  const dispatch = useDispatch();
  const auth = getAuth();

  const onSubmit = async (values) => {
    sendSignInLinkToEmail(auth, values.email, actionCodeSettings, dispatch)
      .then(() => {
        dispatch(setEmail(values.email));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const validate = async (values) => {
    if (!values.email) {
      return { email: "Please enter a valid email address." };
    }
    return;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <Typography
              id="modal-modal-title"
              variant="h3"
              textAlign="center"
              component="h3"
            >
              Login / Signup
            </Typography>
            <Typography variant="body1" color="initial">A login link will be sent to the email address provided.</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <ProfileCircled color="#2E3A59" height={36} width={36} />
              <TextField
                id="email"
                name="email"
                label="Email"
                required={true}
                variant="outlined"
                sx={{ marginLeft: "1rem" }}
              />
            </Box>
            <Container>
              <Button variant="contained" type="submit">
                Login 
              </Button>
            </Container>
          </form>
        </Box>
      )}
    />
  );
}

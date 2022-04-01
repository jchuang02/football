import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { ProfileCircled } from "iconoir-react";
import { TextField } from "mui-rff";
import { Form } from "react-final-form";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { setEmail } from "../../state/actions";
import { useDispatch, useSelector } from "react-redux";

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
  const followed = useSelector((state) => state.followed);
  const email = useSelector((state) => state.email);
  const auth = getAuth();
  const ErrorAlert = (props) => (
    <Alert {...props} severity="error" sx={{ marginTop: 4 }} />
  );

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url:
      followed.teams.length > 0 && followed.leagues.length > 0
        ? "https://football.gatsbyjs.io/"
        : "https://football.gatsbyjs.io/personalize",
    handleCodeInApp: true,
  };
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

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const debounce = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function validate(values) {
    await debounce(500);
    const errors = {};
    if (Object.keys(values).length > 0) {
      if (!values.email) {
        errors.email = "This field is required.";
      } else if (!values.email.match(emailRegex)) {
        errors.email = "This email is not valid.";
      }
      return errors;
    }
    return;
  }

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
            <Typography variant="body1" color="initial" align="center">
              A login link will be sent to the email address provided.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <ProfileCircled color="#2E3A59" height={36} width={36} />
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                required={true}
                FormHelperTextProps={{
                  component: ErrorAlert,
                  children: " ",
                }}
              />
            </Box>
            {email ? (
              <Alert severity="success" sx={{ margin: 2 }}>
                <AlertTitle>Email Sent</AlertTitle>
                <Typography>{`A login email has been sent to ${email}!`}</Typography>
              </Alert>
            ) : (
              ""
            )}
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

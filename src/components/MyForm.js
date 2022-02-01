import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ProfileCircled } from "iconoir-react";
import { TextField } from "mui-rff";
import { Form } from "react-final-form";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "https://localhost:8000",
  handleCodeInApp: true,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MyForm() {
  const onSubmit = async (values) => {
    const auth = getAuth();
    sendSignInLinkToEmail(auth, values.email, actionCodeSettings)
      .then(() => {
        console.log("Email Link Sent");
        //TODO Set LocalStorage Item of EmailForSignIn to the user's email
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
      render={({ handleSubmit, values }) => (
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <Typography
              id="modal-modal-title"
              variant="h3"
              textAlign="center"
              component="h3"
            >
              Login
            </Typography>
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
            <Button type="submit">Submit</Button>
            <pre>{JSON.stringify(values)}</pre>
          </form>
        </Box>
      )}
    />
  );
}

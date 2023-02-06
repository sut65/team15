import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import logo from './image/MedicineRoom.jpg';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import { SigninInterface } from "../models/ISignin";
import { Box, Button, CssBaseline, Link, Paper, TextField } from "@mui/material";
import React from "react";

import Alert from "@mui/material/Alert";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © by "}
      <Link color="inherit" href="https://github.com/sut65/team15">
        Team15
      </Link>{" "}
    </Typography>
  );
}


export default function Signin() {
  const [signin, setSignin] = React.useState<Partial<SigninInterface>>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
    const name = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSignin({ ...signin, [name]: value });
    };
    const login = () => {
      const apiUrl = "http://localhost:8080/login";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signin),
      };
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setSuccess(true);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("uid", res.data.id);
            window.location.reload()
          } else {
            setError(true);
          }
        });
    };
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
      ) => {
      const id = event.target.id as keyof typeof signin;
      const { value } = event.target;
      setSignin({ ...signin, [id]: value });
      };
    const handleClose = (res: any) => {
      if (res === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);

    };

  return (
    <Container component="main" maxWidth="xs">
    <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        เข้าสู่ระบบสำเร็จ
      </Alert>
    </Snackbar>
    <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
      </Alert>
    </Snackbar>
    <CssBaseline />
    <Paper elevation={0} style={{ width: "100%", textAlign: "center", fontSize: 36 }}>
        <Box
          sx={{
            my: 5,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography align="center">
            <img style={{ width: "250px" }} className="img" src={logo} />
          </Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              size="small"
              margin="normal"
              required
              fullWidth
              id="UserName"
              label="UserName"
              name="UserName"
              autoComplete="UserName"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              size="small"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={login}
            >
              Sign In
            </Button>
          <Copyright />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

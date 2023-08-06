import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        Copyright © Clothify Store {new Date().getFullYear()}.
      </Typography>
    );
}

const validateEmail = (email) =>{
  const validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return String(email).match(validRegex);
}


export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [firstNameFieldError, setFirstNameFieldError] = useState(false);
  const [lastNameFieldError, setLastNameFieldError] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState(false);
  const [passwordFieldError, setPasswordFieldError] = useState(false);
  const [isEmailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();
  
  const sigUpBtnClicked = () =>{
    setFirstNameFieldError(false);
    setLastNameFieldError(false);
    setEmailFieldError(false);
    setPasswordFieldError(false);
    setEmailExists(false);

    if(firstName === "" || lastName === "" || email === "" || password === ""){
        if(firstName === "")setFirstNameFieldError(true);
        if(lastName === "")setLastNameFieldError(true);
        if(email === "")setEmailFieldError(true);
        if(password === "")setPasswordFieldError(true);
        return;
    }

    if (!validateEmail(email)){
      setEmailFieldError(true);
      return;
    }

    setBackDropOpen(true);

    fetch('http://192.168.1.20:8080/customer',{
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        user:{
           email: email,
           password: password 
        }
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => res.json())
      .then(data => {

        console.log(data);
        setBackDropOpen(false);
        if(data.success){
            navigate("/verify", {state: {email}});
        }
        if(data.message === "Duplicate Data"){
            setEmailExists(true);
        }
      
      });
  }
  
  

  return (
      <Container component="main" maxWidth="xs">
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backDropOpen}   
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
              <LockOutlinedIcon className='text-[#00C2BE]' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            {
              isEmailExists ? (
                <>
                <Grid item xs={12} >
                <Alert severity="error" className='w-full mt-4'>
                  Email already exists
                </Alert>
                </Grid>
                </>
              ) : null
            }
              <Grid item xs={12} sm={6}>
                <TextField
                  error={firstNameFieldError ? true : false}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={e => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={lastNameFieldError ? true : false}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={e => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={emailFieldError ? true : false}
                  helperText={emailFieldError ? "Not a valid email address" : null}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={passwordFieldError ? true : false}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
              onClick={sigUpBtnClicked}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" className='text-[#1976D2] underline text-sm underline-["red"]'>  
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

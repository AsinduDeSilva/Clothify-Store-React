import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import MyBackdrop from '../Components/MyBackdrop';
import { Alert, Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';


const validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export default function LoginFindEmail() {

  const [backDropOpen, setBackDropOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [txtEmailError, setTxtEmailError] = useState(false);
  const [emailNotExistsError, setEmailNotExistsError] = useState(false);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const navigate = useNavigate();


  const isCustomeExistsByEmail = () => {
    setTxtEmailError(false);
    
    if(!String(email).match(validEmailRegex)){
        setTxtEmailError(true);
        return;
    } 

    setBackDropOpen(true);
    fetch(`${backendAddress}/customer/exists`,{
        method: 'POST',
        body: JSON.stringify({
            email: email
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        if(data){
            navigate("/verify", {state: {email}})
        }else{
            setEmailNotExistsError(true);
        }
     })
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
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
              Find Your Email
            </Typography>
              <p className='mt-3 text-sm'>Enter your email</p>

              {emailNotExistsError ? (
                <Alert severity="error" className='w-full mt-4'>
                  No account found with {email}
                </Alert>
              ):null}
                
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                error={txtEmailError}
                helperText={txtEmailError ? "Enter a valid email" : null}
                sx={{mt:3}}
                onChange={e => {setEmailNotExistsError(false); setEmail(e.target.value)}}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
                onClick={isCustomeExistsByEmail}
              >
                Search
              </Button>
        </Box>
      </Container>
      <MyBackdrop backDropOpen={backDropOpen} />
    </>
  )
}

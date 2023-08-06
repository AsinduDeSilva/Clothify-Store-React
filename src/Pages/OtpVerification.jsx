import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Backdrop, Box, CircularProgress, Container, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PageNotFound from './PageNotFound';
import { useDispatch } from 'react-redux';
import { setLogged } from '../Redux/userInfo';

export default function VerifyOTP() {
  const[otp,setOtp] = useState("");
  const [isOtpExpired, setOtpExpired] = useState(false);
  const [isOtpValid, setOtpValid] = useState(true);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const email = useLocation().state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyBtnClicked = () =>{
    
    setOtpValid(true);
    
    if(otp.length!==6) {
      setOtpValid(false);
      return;
    }

    setBackDropOpen(true);

    fetch('http://192.168.1.20:8080/customer/verify',{
      method: 'POST',
      body: JSON.stringify({
        email: email,
        otp: otp
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false);
        console.log(data);
        if(data.success){
            navigate("/", {replace: true});
            dispatch(setLogged(true));
            return;
        }
        if(data.otpExpired){setOtpExpired(data.otpExpired);return;}
        setOtpValid(false);
      });
  } 
  
  const resendOtpBtnClicked = () =>{
    setOtpExpired(false);
    setBackDropOpen(true);

    fetch('http://192.168.1.20:8080/customer/resend-otp',{
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => setBackDropOpen(false));

  }  

  return (
    <>  
      {email === undefined ? (<PageNotFound/>):(
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backDropOpen}   
          >
            <CircularProgress color="inherit" />
          </Backdrop>
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
              OTP Verification
            </Typography>
            {isOtpExpired ? (
              <>
                <Alert severity="error" className='w-full mt-4'>
                    OTP Expired
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
                  onClick={resendOtpBtnClicked}
                >
                    Resend OTP
                </Button>
              </>
            ):(
              <>
                <p className='mt-3 text-sm'>Enter the 6 digits code sent to your email</p>

                {!isOtpValid ? (
                  <Alert severity="error" className='w-full mt-4'>
                      Incorrect OTP
                  </Alert>
                ):null}
                
                <TextField
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  sx={{mt:3}}
                  onChange={e => setOtp(e.target.value)}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
                  onClick={verifyBtnClicked}
                >
                    Verify
                </Button>
                <div className='w-full flex justify-end'>
                  <Link to="/login" className='text-[#1976D2] underline text-sm underline-["red"]'>  
                      resend OTP
                  </Link>
                </div>
              </>
            )}
          </Box>
          </Container>
        </>
      )}
    </>
  )
}

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Box, Container, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { login, setCart, setCustomerID } from '../Redux/userInfo';
import Cookies from 'js-cookie';
import MyBackdrop from '../Components/MyBackdrop';
import Swal from 'sweetalert2';

export default function OtpVerification() {
  const[otp,setOtp] = useState("");
  const [isOtpExpired, setOtpExpired] = useState(false);
  const [isOtpValid, setOtpValid] = useState(true);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const email = useLocation().state?.email;
  const password = useLocation().state?.password;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {cart} = useSelector(state => state.userInfo);

  const verifyBtnClicked = () =>{
    setOtpValid(true);

    if(otp.length!==6) {
      setOtpValid(false);
      return;
    }
    
    if(password === undefined){   //From ForgetPassword
      authenticateWithOTP();
      return;
    }

    setBackDropOpen(true);

    fetch(`${backendAddress}/customer/verify`,{
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

        if(data.success){
          authenticate();
          return;
        }

        if(data.otpExpired){
          setOtpExpired(data.otpExpired);
          return;
        }
        setOtpValid(false);
      });
  }

  const authenticate = () =>{

    setBackDropOpen(true);
    fetch(`${backendAddress}/authenticate`,{
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false);

        if(data.success){
          if(data.customer){
            loadCustomerDetails(data.jwt)
            navigate("/", {replace: true})
          }else{
            navigate("/admin/dashboard", {replace: true});
          }
          dispatch(login({isCustomer: data.customer, jwt: data.jwt, remember: true}));
          Swal.fire({
            icon: 'success',
            title: 'Happy Shopping',
            text: "Account created successfully",
            confirmButtonText: 'OK',
            confirmButtonColor: '#000000'
          }) 
          return;
        }

      });   
  }

  const authenticateWithOTP = () =>{

    setBackDropOpen(true);
    fetch(`${backendAddress}/authenticate/otp`,{
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

        if(data.success){
          loadCustomerDetails(data.jwt);
          if(data.customer){
            navigate("/login/change-password", {state: {authData: data}, replace: true})
          }
          return;
        }

        if(data.credentialsValid){
          setOtpExpired(true);
          return;
        }

        setOtpValid(false);
      });   
  }
  
  const loadCustomerDetails = (jwt) =>{
    setBackDropOpen(true)
    fetch(`${backendAddress}/customer/email`,{  
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    .then(res => res.json())
    .then(async data => {
      setBackDropOpen(false)
      Cookies.set('customerID',data.customerID, {expires: 7})
      dispatch(setCustomerID(data.customerID))

      if(password === undefined){  //From Forget Password
        dispatch(setCart(data.cart)); 
      }else{  //From sign up
        await setServerCart(cart, data.customerID, jwt);
        Cookies.remove('cart');
      }

    })
  }

  const setServerCart = async (cart, customerID, jwt) => {
    setBackDropOpen(true);
    const response = await fetch(`${backendAddress}/customer/cart/set/${customerID}`,{  
      method: 'Post',
      body: JSON.stringify(cart),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
    return response;
  }
  
  const resendOtpBtnClicked = () =>{
    setOtpExpired(false);
    setBackDropOpen(true);

    fetch(`${backendAddress}/customer/resend-otp`,{
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
      {email === undefined ? null : (
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

          <MyBackdrop backDropOpen={backDropOpen} />
        </>
      )}
    </>
  )
}

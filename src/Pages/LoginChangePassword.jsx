import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import MyBackdrop from '../Components/MyBackdrop';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../Redux/userInfo';
import Swal from 'sweetalert2';

export default function LoginChangePassword() {

  const [backDropOpen, setBackDropOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [txtNewPasswordError, setTxtNewPasswordError] = useState(false);
  const [txtConfirmPasswordError, setTxtConfirmPasswordError] = useState(false);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {customerID} = useSelector(state => state.userInfo);
  const authData = useLocation().state?.authData;  //got from authentication
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changePassword = () => {
    if(!checkValidity()){
        return;
    }

    fetch(`${backendAddress}/customer/password/${customerID}`,{  
        method: 'PUT',
        body: JSON.stringify({
          password: newPassword
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${authData.jwt}`,
        }})
          .then(res => res.json())
          .then(data => {
              setBackDropOpen(false);
              if(data.success){
                dispatch(login({isCustomer: authData.customer, jwt: authData.jwt, remember: true}));
                setTimeout(() => {
                    navigate("/", {replace: true})
                }, 50);
                //navigate(0);
              }
              Swal.fire({
                  icon: 'success',
                  title: 'Password Changed',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#000000'
              })       
          })

  }

  const checkValidity = () => {

    setTxtNewPasswordError(false);
    setTxtConfirmPasswordError(false);

    let isValid = true;          

    if(newPassword === ""){
        setTxtNewPasswordError(true)
        isValid = false;
    }

    if(confirmPassword === ""){
        setTxtConfirmPasswordError(true);
        isValid = false;
    }

    if(confirmPassword !== newPassword){
        setTxtConfirmPasswordError(true);
        setTxtNewPasswordError(true)
        isValid = false;
    }

    return isValid;
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
              Change Your Email
            </Typography>
              <p className='mt-3 text-sm'>Enter your email</p>
                
              <TextField
                required
                fullWidth
                id="newPassword"
                label="New Password"
                error={txtNewPasswordError}
                sx={{mt:3}}
                value={newPassword}
                onChange={e => {/*setEmailNotExistsError(false); */ setNewPassword(e.target.value)}}
              />

              <TextField
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                error={txtConfirmPasswordError}
                sx={{mt:3}}
                value={confirmPassword}
                onChange={e => {/*setEmailNotExistsError(false);*/ setConfirmPassword(e.target.value)}}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
                onClick={changePassword}
              >
                Change Password
              </Button>
        </Box>
      </Container>
      <MyBackdrop backDropOpen={backDropOpen} />
    </>
  )
}

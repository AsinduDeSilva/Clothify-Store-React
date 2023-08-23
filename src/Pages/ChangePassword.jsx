import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container, TextField } from '@mui/material'
import Footer from '../Components/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs';
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { logout, setCustomerID } from '../Redux/userInfo'
import Swal from 'sweetalert2'
import MyBackdrop from '../Components/MyBackdrop'


export default function ChangePassword() {

  const customerDetails = useLocation().state?.customerDetails; 
  const {customerID, isCustomer} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [txtCurrentPasswordError, setTxtCurrentPasswordError] = useState(false);
  const [txtNewPasswordError, setTxtNewPasswordError] = useState(false);
  const [txtConfirmPasswordError, setTxtConfirmPasswordError] = useState(false);

  

  const btnChangePasswordOnClick = async () => {
    if(! await checkValidity()) return;

    setBackDropOpen(true)
    
    fetch(`http://${backendAddress}/customer/password/${customerID}`,{  
      method: 'PUT',
      body: JSON.stringify({
        password: newPassword
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }})
        .then(res => res.json())
        .then(data => {
            setBackDropOpen(false)
            if(data.success){
                Cookies.remove('jwt');
                Cookies.remove('customerID')
                dispatch(logout())
                dispatch(setCustomerID(undefined))
                navigate('/login', {replace: true})
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: 'Please login again',
                    confirmButtonText: 'OK'
                })
            }
        })

  }

  const checkValidity = async () => {

    setTxtCurrentPasswordError(false);
    setTxtNewPasswordError(false);
    setTxtConfirmPasswordError(false);

    let isValid = true;
    const isMatch = await bcrypt.compare(currentPassword, customerDetails.user.password);
           
    if(!isMatch) {
        setTxtCurrentPasswordError(true);
        isValid = false;
    };

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
    <div>
        {!isCustomer || customerDetails === undefined ? null : (
            <>
                <Navbar />
                <Heading name='Change Password' />
                <Container maxWidth='sm'>
                    <div className='flex items-center justify-between mb-5'>
                        <TextField 
                            label="Current Password" 
                            variant="outlined" 
                            fullWidth 
                            type='password'
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)} 
                            error = {txtCurrentPasswordError}
                            helperText = {txtCurrentPasswordError ? "Wrong password" : null}
                        />
                    </div>
                    <div className='flex items-center justify-between mb-5'>
                        <TextField 
                            label="New Password" 
                            variant="outlined" 
                            fullWidth 
                            type='password'
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)} 
                            error = {txtNewPasswordError}
                        />
                    </div>
                    <div className='flex items-center justify-between mb-7'>
                        <TextField 
                            label="Confirm Password" 
                            variant="outlined" 
                            fullWidth 
                            type='password'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)} 
                            error = {txtConfirmPasswordError}
                        />
                    </div>
                
                    <div className='flex items-center justify-end mb-10'>
                        <Button 
                            variant="contained" 
                            size={window.innerWidth > 350 ? 'large' : 'medium'}
                            sx={btnStyle1}  
                            onClick={btnChangePasswordOnClick}         
                        >
                            Change Password
                        </Button>
                    </div>
                </Container>

                <Footer/>

                <MyBackdrop backDropOpen={backDropOpen} />
            </>
        )}
    </div>
  )
}

const btnStyle1 ={
    backgroundColor:'black',
    borderRadius:'25px',
    ":hover":{
      backgroundColor:"black"
    }
}

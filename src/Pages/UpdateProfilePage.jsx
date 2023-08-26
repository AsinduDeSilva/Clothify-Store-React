import { Button, Container, TextField } from '@mui/material';
import React, { useState } from 'react'
import Navbar from '../Components/Navbar';
import Heading from '../Components/Heading';
import Footer from '../Components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MyBackdrop from '../Components/MyBackdrop';

export default function UpdateProfilePage() {
  
  const {customerID, isCustomer, jwt} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo); 
  const navigate = useNavigate(); 
  const customerDetails = useLocation().state?.customerDetails;  
  const [firstName, setFirstName] = useState(customerDetails?.firstName);
  const [lastName, setLastName] = useState(customerDetails?.lastName);
  const [address, setAddress] = useState(customerDetails?.address);
  const [phoneNo, setPhoneNo] = useState(customerDetails?.mobileNo);

  const [backDropOpen, setBackDropOpen] = useState(false);
  const [txtFirstNameError, setTxtFirstNameError] = useState(false);
  const [txtLastNameError, setTxtLastNameError] = useState(false);
  const [txtAddressError, setTxtAddressError] = useState(false);
  const [txtPhoneNoError, setTxtPhoneNoError] = useState(false);

  const checkValidity = () => {

    setTxtFirstNameError(false);
    setTxtLastNameError(false);
    setTxtAddressError(false);
    setTxtPhoneNoError(false);

    let isValid = true;
    if(firstName === ""){
      setTxtFirstNameError(true);
      isValid = false;
    }

    if(lastName === ""){
      setTxtLastNameError(true);
      isValid = false;
    }

    if(address === "" || address === null){
      setTxtAddressError(true);
      isValid = false;
    }

    if(!phoneNo?.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
      setTxtPhoneNoError(true);
      isValid = false;
    }

    return isValid;
  }

  const btnUpdateOnClick = () => {
    if(!checkValidity()) return;

    setBackDropOpen(true)

    fetch(`${backendAddress}/customer/${customerID}`,{  
      method: 'PUT',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        mobileNo: phoneNo 
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }})
        .then(res => res.json())
        .then(data => {
            setBackDropOpen(false)
            if(data.success){
                navigate("/profile/overview", {replace: true})
                Swal.fire({
                    icon: 'success',
                    text: 'Successfully Updated',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#636C74',
                })
            }
        })

  }

  return (
    <div>
        { !isCustomer || customerDetails === undefined ? null : (
            <>
                <Navbar />
                <Heading name='Update Profile' />
                <Container maxWidth='sm'>
                    <div className='flex items-center justify-between mb-5'>
                    <TextField 
                        id="outlined-basic" 
                        label="First name" 
                        variant="outlined" 
                        fullWidth 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)} 
                        error = {txtFirstNameError}
                    />
                    </div>
                    <div className='flex items-center justify-between mb-5'>
                    <TextField 
                        id="outlined-basic" 
                        label="Last name" 
                        variant="outlined" 
                        fullWidth 
                        value={lastName}
                        onChange={e => setLastName(e.target.value)} 
                        error = {txtLastNameError}
                    />
                    </div>
                    <div className='flex items-center justify-between mb-5'>
                    <TextField 
                        id="outlined-basic" 
                        label="Phone" 
                        variant="outlined" 
                        fullWidth 
                        value={phoneNo}
                        onChange={e => setPhoneNo(e.target.value)} 
                        error = {txtPhoneNoError}
                    />
                    </div>
                    <div className='flex items-center justify-between mb-5'>
                    <TextField 
                        id="outlined-basic" 
                        label="Address" 
                        variant="outlined" 
                        fullWidth 
                        multiline
                        value={address}
                        onChange={e => setAddress(e.target.value)} 
                        error = {txtAddressError}
                    />
                    </div>
                    <div className='flex items-center justify-end mb-10'>
                        <Button 
                            variant="contained" 
                            size={window.innerWidth > 350 ? 'large' : 'medium'}
                            sx={btnStyle1}  
                            onClick={btnUpdateOnClick}         
                        >
                            Update
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

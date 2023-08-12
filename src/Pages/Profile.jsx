import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container, TextField } from '@mui/material'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Footer from '../Components/Footer';

export default function Profile() {
  const {customerID, isLogged} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [textFieldEditable, setTextFieldEditable] = useState(false);

  useEffect(() => {
    loadCustomerDetails();
  },[])

  const loadCustomerDetails = () =>{
    setBackDropOpen(true)
    fetch(`http://${backendAddress}/customer/${customerID}`,{  
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      setBackDropOpen(false); 
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setAddress(data.address);
      setPhoneNo(data.mobileNo);
    })
  }

  return (
    <div>
      <Navbar />
      <Heading name="Profile" />

      <Container maxWidth="sm" className='flex items-center justify-center'>
        <div className='flex items-center justify-between mb-5'>
          <TextField 
            id="outlined-basic" 
            label="First name" 
            variant="outlined" 
            fullWidth 
            value={firstName}
            InputProps={{
              readOnly: !textFieldEditable,
            }} 
          />
        </div>
        <div className='flex items-center justify-between mb-5'>
          <TextField 
            id="outlined-basic" 
            label="Last name" 
            variant="outlined" 
            fullWidth 
            value={lastName}
            InputProps={{
              readOnly: !textFieldEditable,
            }} 
          />
        </div>
        <div className='flex items-center justify-between mb-5'>
        <TextField 
            id="outlined-basic" 
            label="Phone" 
            variant="outlined" 
            fullWidth 
            value={phoneNo}
            InputProps={{
              readOnly: !textFieldEditable,
            }} 
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
            InputProps={{
              readOnly: !textFieldEditable,
            }} 
          />
        </div>
        <div className='flex items-center justify-end mb-10'>
          <Button 
            variant="contained" 
            size={window.innerWidth > 350 ? 'large' : 'medium'}
            sx={btnStyle1}  
            //onClick={btnCheckoutOnClick}         
          >
            Edit
          </Button>
        </div>
      </Container>

      <Footer/>
    </div>
  )
}

const btnStyle1 ={
  backgroundColor:'black',
  borderRadius:'25px',
  px:5,
  ":hover":{
    backgroundColor:"black"
  }
}


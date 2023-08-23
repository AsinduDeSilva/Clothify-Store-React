import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logout, setCustomerID } from '../Redux/userInfo';
import MyBackdrop from '../Components/MyBackdrop';


export default function Profile() {
  const {customerID, isCustomer} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [customerDetails, setCustomerDetails] = useState({});
  const [backDropOpen, setBackDropOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      setCustomerDetails(data)
    })
  }

  const btnUpdateProfileOnClick = () => {
    navigate("/profile/update", {state:{customerDetails}});
  }

  const btnChangePasswordOnClick = () => {
    navigate("/profile/change-password", {state: {customerDetails}})
  }

  const btnDeleteAccountOnClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Delete',
      customClass:{
        confirmButton: 'confirm-delete'
      }
    }).then((result) => {
      if (result.isConfirmed) {

        setBackDropOpen(true)
        fetch(`http://${backendAddress}/customer/${customerID}`,{  
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`,
          }
        })
        .then(res => res.json())
        .then(data => {
            setBackDropOpen(false); 
            if(data.success){
                Cookies.remove('jwt');
                Cookies.remove('customerID')
                dispatch(logout())
                dispatch(setCustomerID(undefined))
                navigate('/', {replace: true})
                Swal.fire(
                  'Deleted!',
                  'Your account has been deleted.',
                  'success'
                )
            }
        })
      }
    })
  }

  return (
    <div>
      {!isCustomer ? null : (
        <>
          <Navbar />
          <Heading name="Profile" />

          <Container maxWidth="sm" className='flex'>
            <div className='flex border-b border-white h-[60px]'>
              <div className='w-[40%] border-r border-white flex items-center justify-center bg-[#212529] text-white text-[15px]'>
                First name
              </div>
              <div className='w-full flex items-center bg-[#D9D9D9] text- text-[14px] px-2'>
                {customerDetails.firstName}
              </div>
            </div>
            <div className='flex h-[60px] border-b border-white'>
              <div className='w-[40%] border-r border-white flex items-center justify-center bg-[#212529] text-white text-[15px]'>
                Last name
              </div>
              <div className='w-full flex items-center bg-[#D9D9D9] text-[14px] px-2'>
                {customerDetails.lastName}
              </div>
            </div>
            <div className='flex h-[60px] border-b border-white'>
              <div className='w-[40%] border-r border-white flex items-center justify-center bg-[#212529] text-white text-[15px]'>
                Phone No
              </div>
              <div className='w-full flex items-center bg-[#D9D9D9] text-[14px] px-2'>
                {customerDetails.mobileNo}
              </div>
            </div>
            <div className='flex h-[100px] border-b border-white'>
              <div className='w-[40%] border-r border-white flex items-center justify-center bg-[#212529] text-white text-[15px]'>
                Address
              </div>
              <div className='w-full flex items-center bg-[#D9D9D9] text-[14px] px-2'>
                {customerDetails.address}
              </div>
            </div>
            
            <div className='xs:flex justify-between my-5'>
              <div className='flex justify-end mb-2 xs:block xs:mb-0'>
                <Button 
                  variant="contained" 
                  size='medium'
                  sx={btnStyle1}  
                  onClick={btnChangePasswordOnClick}         
                >
                  Change Password
                </Button>
              </div>
              <div className='flex justify-end xs:block'>
                  <Button 
                    variant="contained" 
                    size='medium'
                    sx={btnStyle1}  
                    onClick={btnUpdateProfileOnClick}         
                  >
                    Update Profile
                  </Button>
              </div>
            </div>

            <hr />

            <div className='mt-5 mb-10 flex justify-end'>
              <Button 
                variant="contained" 
                size='medium'
                color='error' 
                sx={{borderRadius:'25px'}}
                onClick={btnDeleteAccountOnClick}         
              >
                  Delete Account
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


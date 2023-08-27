import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logout } from '../Redux/userInfo';
import MyBackdrop from '../Components/MyBackdrop';


export default function Profile() {
  const {customerID, jwt} = useSelector(state => state.userInfo);
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
    fetch(`${backendAddress}/customer/${customerID}`,{  
      headers: {
        'Authorization': `Bearer ${jwt}`,
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
    }).then(async (result) => {
      if (result.isConfirmed) {

        setBackDropOpen(true)
        const response = await fetch(`${backendAddress}/order/customer/count/${customerID}`,{  
          headers: {
            'Authorization': `Bearer ${jwt}`,
          }
        })
        setBackDropOpen(false); 
        const data = await response.json();
        console.log(data)
        if(data > 0){
          Swal.fire({
            title: 'Delete Failed!',
            text: 'You have an Ongoing order',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#636C74'
          })
          return;
        }

        setBackDropOpen(true)
        fetch(`${backendAddress}/customer/${customerID}`,{  
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${jwt}`,
          }
        })
        .then(res => res.json())
        .then(data => {
            setBackDropOpen(false); 
            if(data.success){
                dispatch(logout())
                navigate('/', {replace: true})
                Swal.fire({
                  title: 'Deleted!',
                  text: 'Your account has been deleted.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#636C74'
                })
            }
        })
      }
    })
  }

  return (
    <div>
          <Navbar />
          <Heading name="Profile" />

          <Container maxWidth="md" className='flex'>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500">First name</dt>
                    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{customerDetails.firstName}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500">Last name</dt>
                    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{customerDetails.lastName}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500">Phone no</dt>
                    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{customerDetails.mobileNo}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{customerDetails.user?.email}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
                      {customerDetails.address}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm sm:text-md font-medium text-gray-500 mb-3">Actions</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>
                          <Button 
                            variant="contained" 
                            size='small'
                            sx={btnStyle1}  
                            onClick={btnChangePasswordOnClick}         
                          >
                            Change Password
                          </Button>
                        </div>

                        <br />
                        <div>
                          <Button 
                            variant="contained" 
                            size='small'
                            sx={btnStyle1}  
                            onClick={btnUpdateProfileOnClick}         
                            >
                            Update Profile
                          </Button>
                        </div>

                        <br />
                        
                        <div>
                          <Button 
                            variant="contained" 
                            size='small'
                            color='error' 
                            sx={{borderRadius:'25px', py: 1,}}
                            onClick={btnDeleteAccountOnClick}         
                          >
                              Delete Account
                          </Button>
                        </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Container>

          <Footer/>

          <MyBackdrop backDropOpen={backDropOpen} />
        </div>
  )
}

const btnStyle1 ={
  backgroundColor:'#212529',
  borderRadius:'25px',

  py: 1,
  ":hover":{
    backgroundColor:"#000000"
  }
}


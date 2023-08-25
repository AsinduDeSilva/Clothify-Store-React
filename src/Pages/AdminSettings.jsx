import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { logout } from '../Redux/userInfo';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';
import MyBackdrop from '../Components/MyBackdrop';
import isDesktop from '../CheckDevice';



export default function AdminSettings() {

  const {backendAddress} = useSelector(state => state.backendInfo); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); 
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
    
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [txtCurrentPasswordError, setTxtCurrentPasswordError] = useState(false);
  const [txtNewPasswordError, setTxtNewPasswordError] = useState(false);
  const [txtConfirmPasswordError, setTxtConfirmPasswordError] = useState(false);

  const loadAdminDetails = () => {
    setBackDropOpen(true);

    fetch(`http://${backendAddress}/admin`,{
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      setBackDropOpen(false);
      setPassword(data.user.password);
    })

  }

  useEffect(() => {
    loadAdminDetails();
  }, []);

  const btnChangePasswordOnClick = async () => {
    if(! await checkValidity()) return;

    setBackDropOpen(true);
    
    fetch(`http://${backendAddress}/admin`,{  
      method: 'PUT',
      body: JSON.stringify({
        password: newPassword
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
          setBackDropOpen(false);
          if(data.success){
              Cookies.remove('jwt');
              dispatch(logout());
              navigate('/login', {replace: true});
              Swal.fire({
                  icon: 'success',
                  title: 'Password Changed',
                  text: 'Please login again',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#636C74'
              })
          }
      })

  }

  const checkValidity = async () => {

    setTxtCurrentPasswordError(false);
    setTxtNewPasswordError(false);
    setTxtConfirmPasswordError(false);

    let isValid = true;
    const isMatch = await bcrypt.compare(currentPassword, password);
           
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
    <>
      {!isDesktop ? null : (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3] '><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='bg-[#1E1E1E] h-full mx-2'>
              <div className='mx-3 h-[40%] text-white'>
                <p className='pt-4 ml-4 text-2xl font-semibold'>Change Password</p>
    
                <div className='ml-[2%] w-[40%] flex justify-between items-center mt-8'>
                  <span className='text-[15px]'>Current Password</span>
                  <CssTextField 
                    variant="outlined" 
                    size='small' 
                    type='password'
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)} 
                    error={txtCurrentPasswordError}
                    helperText = {txtCurrentPasswordError ? "Wrong password" : null}
                  />
                </div>
                <div className='ml-[2%] w-[40%]  flex justify-between items-center mt-3'>
                  <span className='text-[15px]'>New Password</span>
                  <CssTextField  
                    variant="outlined" 
                    size='small' 
                    type='password'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} 
                    error={txtNewPasswordError}
                  />
                </div>
                <div className='ml-[2%] w-[40%]  flex justify-between items-center mt-3'>
                  <span className='text-[15px]'>Confirm Password</span>
                  <CssTextField  
                    variant="outlined" 
                    size='small'
                    type='password' 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} 
                    error={txtConfirmPasswordError}
                  />
                </div>
                <div className='ml-[2%] w-[40%]  flex justify-end my-6'>
                  <Button 
                    variant='contained' 
                    sx={{py: 1.5, px: 1, background: '#026472', ":hover":{background: '#026C7B'}}} 
                    size='small'
                    onClick={btnChangePasswordOnClick} 
                  >
                      Change Password
                  </Button>
                </div>
                <hr/>
              </div>
            </div>
          </div>
          <MyBackdrop backDropOpen={backDropOpen} />
        </div>
      )}
    </>
  )
}

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color:"white",
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

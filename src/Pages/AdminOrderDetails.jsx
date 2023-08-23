import React from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Link, useParams } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { ExpandCircleDownOutlined } from '@mui/icons-material'

export default function AdminOrderDetails() {

  const {orderID} = useParams();


  return (
    <div className='flex-row flex h-[100vh] '>
      <div className='flex-[3] '><AdminSidePanel/></div>
      <div className='flex-[11] bg-[#141414] -ml-1'>
        <div className='h-[13%] flex items-center mr-5'>
          <Link to={'..'}>
            <IconButton sx={{ml:2}}>
              <ExpandCircleDownOutlined fontSize='large' className='text-white rotate-90'/> 
            </IconButton>
          </Link>
        </div>
        <div className='text-white bg-[#1E1E1E] mx-2 h-[87%] flex flex-col overflow-y-scroll hide-scrollbar'>
          
        </div>
      </div>
    </div>        
  )
}

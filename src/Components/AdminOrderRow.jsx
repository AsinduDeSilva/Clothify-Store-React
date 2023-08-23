import React, { useState } from 'react'
import MyBackdrop from './MyBackdrop'
import { FormControl, IconButton, MenuItem, Select } from '@mui/material'
import { ExpandCircleDownOutlined } from '@mui/icons-material'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function AdminOrderRow({order, customerName}) {

  const navigate = useNavigate();
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [status, setStatus] = useState(order.status);

  const updateOrderStatus = (newStatus) => {
    setBackDropOpen(true)

    fetch(`http://${backendAddress}/order/${order.orderID}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`,
        },
    })
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        if(data.success){
          Swal.fire({
            title: 'Success!',
            text: 'Order has been updated.',
            icon: 'success',
            confirmButtonColor: '#484848',
            customClass:{
              popup: 'bg-[#1E1E1E] text-white'
            }
          })
        }
    })
  }

  const selectStatusOnChange = (status) => {
    setStatus(status);
    Swal.fire({
      title: 'Are you sure?',   
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#484848',
      confirmButtonText: 'Update',
      confirmButtonColor: '#026472',
      customClass:{
        popup: 'bg-[#1E1E1E] text-white'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let newStatus;
        switch (status) {
          case "PENDING" : newStatus = 0; break;
          case "PROCESSING" : newStatus = 1; break;
          case "OUT_FOR_DELIVERY" : newStatus = 2; break;
          case "DELIVERED" : newStatus = 3; break;
          case "CANCELLED" : newStatus = 4; break;
        }
        updateOrderStatus(newStatus);
      }else{
        setStatus(order.status);
      }
    })  
  }


  return (
    <div className='flex flex-row text-white mx-5 h-[12%] rounded-[12px] bg-[#141414] mb-3 '>
        <div className='flex-[2] flex items-center justify-center '>{order.orderID}</div>
        <div className='flex-[2] flex items-center justify-center '>{order.customerID}</div>
        <div className='flex-[4] flex items-center '>
            <span className='ml-2'>{customerName}</span>
        </div>
        <div className='flex-[2] flex items-center justify-center'>{order.dateAndTime.substring(0,10)}</div>
        <div className='flex-[2] flex justify-center items-center flex-col text-sm'>
            <FormControl sx={{scale: '0.9'}}>
                <Select    
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"   
                  value={status}
                  size='small'
                  onChange={e => selectStatusOnChange(e.target.value)}
                  sx={{width: 175, backgroundColor: '#e5e5e5', borderRadius: 1}}
                >    
                  <MenuItem value={"PENDING"}>Pending</MenuItem>
                  <MenuItem value={"PROCESSING"}>Processing</MenuItem>
                  <MenuItem value={"OUT_FOR_DELIVERY"}>Out For Delivery</MenuItem>
                  <MenuItem value={"DELIVERED"}>Delivered</MenuItem>
                  <MenuItem value={"CANCELLED"}>Cancelled</MenuItem>
                </Select>
            </FormControl>  
        </div>
        <div className='flex-[2] flex items-center justify-center text-white'>
            <IconButton 
              sx={{"&:hover, &.Mui-focusVisible": { backgroundColor: "#484848" }}}
              onClick={e => navigate(`${order.orderID}`)}
            >
              <ExpandCircleDownOutlined className='text-white -rotate-90'/>
            </IconButton>
        </div> 

        <MyBackdrop backDropOpen={backDropOpen}/>
    </div>
  )
}

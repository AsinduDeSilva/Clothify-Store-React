import { Delete, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MyBackdrop from './MyBackdrop';

export default function AdminProductRow({productDetails, setProductList, index}) {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const [backDropOpen, setBackDropOpen] = useState(false);

  const btnDeleteOnClick = (productID) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#484848',
      confirmButtonText: 'Delete',
      customClass:{
        confirmButton: 'confirm-delete',
        popup: 'bg-[#1E1E1E] text-white'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setBackDropOpen(true);

        fetch(`http://${backendAddress}/product/${productID}` ,{
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`,
          }
        })
          .then(res => res.json())
          .then(data => {
            setBackDropOpen(false);
            if(data.success){
              Swal.fire({
                title: 'Deleted!',
                text: 'Product has been deleted.',
                icon: 'success',
                confirmButtonColor: '#484848',
                customClass:{
                  popup: 'bg-[#1E1E1E] text-white'
                }
              })
              setProductList(prev => {
                let productList = [...prev];
                productList.splice(index,1)
                return productList;
              })
            }
          })
      }
    })    
  }

  return ( 
    <div className='flex flex-row text-white mx-5 h-[20%] rounded-[12px] bg-[#141414] mb-3'>
        <div className='flex-[2] flex items-center justify-center '>{productDetails.productID}</div>
        <div className='flex-[2] flex items-center justify-center '>
            <img src= {`http://192.168.1.20:8080/product/image/${productDetails.imgFileName}`} alt="product" className='h-[90%] rounded'/>
        </div>
        <div className='flex-[4] flex items-center  '>{productDetails.name}</div>
        <div className='flex-[2] flex items-center justify-center'>{productDetails.unitPrice.toFixed(2)}</div>
        <div className='flex-[2] flex justify-center items-center flex-col text-sm'>
            <div className='flex justify-between items-center w-[70%]'>
                <p>Small</p>
                <p>{productDetails.smallQty}</p>
            </div>
            <div className='flex justify-between items-center w-[70%]'>
                <p className=''>Medium</p>              
                <p>{productDetails.mediumQty}</p>
            </div>
            <div className='flex justify-between items-center w-[70%]'>
                <p className=''>Large</p>            
                <p>{productDetails.largeQty}</p>
            </div>
        </div>
        <div className='flex-[2] flex items-center justify-center text-white'>
            <IconButton 
              sx={{"&:hover, &.Mui-focusVisible": { backgroundColor: "#484848" }}}
            >
              <Edit className='text-white'/>
            </IconButton>
            <IconButton
              sx={{"&:hover, &.Mui-focusVisible": { backgroundColor: "#484848" }}}
              onClick={e => btnDeleteOnClick(productDetails.productID)}
            >
              <Delete className='text-white'/>
            </IconButton>
        </div> 

        <MyBackdrop backDropOpen={backDropOpen}/>
    </div>
  )
}

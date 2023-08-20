import { Delete, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'

export default function AdminProductRow({productDetails}) {
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
            <IconButton><Edit sx={{fontSize: 27}}  className='text-white'/></IconButton>
            <IconButton><Delete sx={{fontSize: 27}}  className='text-white'/></IconButton>
        </div> 
    </div>
  )
}

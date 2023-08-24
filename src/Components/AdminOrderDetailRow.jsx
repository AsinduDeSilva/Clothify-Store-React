import React from 'react'

export default function AdminOrderDetailRow({orderDetail, productName}) {
  return (
    <div className='flex flex-row text-white mx-5 h-[6vh] rounded-[12px] bg-[#141414] mb-3 '>
      <div className='flex-[2] flex items-center justify-center '>{orderDetail.productID}</div>
      <div className='flex-[3] flex items-center '>{productName}</div>
      <div className='flex-[2] flex items-center justify-center'>{orderDetail.size}</div>
      <div className='flex-[2] flex items-center justify-center'>{orderDetail.quantity}</div>
      <div className='flex-[2] flex items-center justify-center'>{orderDetail.unitPrice.toFixed(2)}</div>
      <div className='flex-[2] flex items-center justify-end '>
        <p className='mr-3'>{(orderDetail.quantity * orderDetail.unitPrice).toFixed(2)}</p>
      </div> 
    </div>
  )
}

import React from 'react'


export default function AdminCustomerRow({customer}) {
  return (
    <div className='flex flex-row text-white mx-5 min-h-[9%] rounded-[12px] bg-[#141414] mb-3 text-[15px] py-2'>
      <div className='flex-[2] flex items-center justify-center'>{customer.customerID}</div>
      <div className='flex-[2] flex items-center justify-center'>{customer.firstName}</div>
      <div className='flex-[2] flex items-center justify-center'>{customer.lastName}</div>
      <div className='flex-[2] flex items-center justify-center'>{customer.mobileNo}</div>
      <div className='flex-[4] flex items-center'>
        <p className='ml-3'>
            {customer.user.email}
        </p>
      </div>
      <div className='flex-[4] flex flex-col justify-center'>
        {customer.address?.split(",").map((line, index, array) => (
          <p key={index}>{line}{index === array.length - 1 ? null : ','}</p>
        ))}  
      </div> 
    </div>        
  )
}

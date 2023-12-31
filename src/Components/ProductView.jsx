import React from 'react'
import { useSelector } from 'react-redux';

export default function ProductView(props) {
  const {backendAddress} = useSelector(state => state.backendInfo);

  return (
    <div className='rounded-[20px] overflow-hidden hover:cursor-pointer shadow-xl hover:shadow-2xl transition-time z-0 bg-white'>
        <div className='overflow-hidden'>
            <img src={`${backendAddress}/product/image/${props.image}`} className='w-full aspect-[0.7] hover:scale-110 transition-time hover:fill-transparent' alt="product" />
        </div>
        <div className='mt-3 ml-3 pb-1'>
            <h1 className='font-semibold md:text-[16px] text-sm text-gray-600'>{props.name}</h1>
            <p className='md:text-[16px] text-sm my-1 md:my-2 text-gray-900 font-semibold'>LKR {props.price.toFixed(2)}</p>
        </div>
    </div>
  )
}

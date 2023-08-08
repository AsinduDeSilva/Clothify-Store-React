import React from 'react'
import { useSelector } from 'react-redux';

export default function ProductView(props) {
  const {backendAddress} = useSelector(state => state.backendInfo);

  return (
    <div className='rounded-[20px] overflow-hidden hover:cursor-pointer shadow-xl hover:shadow-2xl transition-time z-0'>
        <div className='overflow-hidden'>
            <img src={`http://${backendAddress}/product/image/${props.image}`} className='w-full xl:h-[360px] sm:h-[320px] xs:h-[250px] h-[200px] hover:scale-110 transition-time hover:fill-transparent' alt="product" />
        </div>
        <div className='mt-3 ml-3 pb-1'>
            <h1 className='font-semibold md:text-[16px] text-sm text-gray-600'>{props.name}</h1>
            <p className='md:text-[16px] text-sm my-1 md:my-2 text-gray-900 font-semibold'>LKR {props.price.toFixed(2)}</p>
        </div>
    </div>
  )
}

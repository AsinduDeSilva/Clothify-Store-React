import React from 'react'

export default function ProductView(props) {
  return (
    <div className='rounded-[20px] overflow-hidden hover:cursor-pointer shadow-xl hover:shadow-2xl transition-time'>
        <div className='overflow-hidden'>
            <img src={props.image} className='w-full xl:h-[450px] md:h-[370px] sm:h-[320px] h-[250px] hover:scale-110 transition-time hover:fill-transparent' alt="product" />
        </div>
        <div className='md:mt-4 mt-3 ml-3 pb-1'>
            <h1 className='font-semibold md:text-lg text-sm text-gray-600'>{props.name}</h1>
            <p className='md:text-sm my-1 md:my-2 text-xs text-gray-900'>LKR {props.price}</p>
        </div>
    </div>
  )
}

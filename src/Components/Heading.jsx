import React from 'react'

export default function Heading(props) {
  return (
    <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 xl:pt-12 md:pt-8 pt-6 sm:pt-6 xl:pb-14 md:pb-11 sm:pb-9 pb-8'>
        <div className='2xl:text-4xl md:text-3xl text-2xl  font-semibold '>
          {props.name}
        </div>
        <hr className='md:mt-5 sm:mt-3 mt-2 border-black border-[1px]'/> 
      </div>
  )
}

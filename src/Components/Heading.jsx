import React from 'react'

export default function Heading(props) {
  return (
    <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-14 xl:pt-8 md:pt-8 pt-6 xl:pb-10 md:pb-11 sm:pb-9 pb-8'>
        <div className=' md:text-3xl text-2xl  font-[600] '>
          {props.name}
        </div>
        <hr className='md:mt-4 sm:mt-3 mt-2 border-black border-[1px]'/> 
      </div>
  )
}

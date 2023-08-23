import React from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'

export default function AdminDashboard() {
  return (
    <div className='flex-row flex h-[100vh] '>
        <div className='flex-[3] '><AdminSidePanel/></div>
        <div className='flex-[11] bg-[#141414] -ml-1'>

        </div>
    </div>    
            
  )
}

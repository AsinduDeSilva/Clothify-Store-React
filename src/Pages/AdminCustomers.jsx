import React, { useEffect, useState } from 'react'
import AdminPanelMobileWarning from '../Components/AdminPanelMobileWarning'
import AdminSidePanel from '../Components/AdminSidePanel'
import isDesktop from '../CheckDevice'
import { Pagination } from '@mui/material'
import { useSelector } from 'react-redux'
import MyBackdrop from '../Components/MyBackdrop'
import AdminCustomerRow from '../Components/AdminCustomerRow'

export default function AdminCustomers() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const {jwt} = useSelector(state => state.userInfo);
  const [customerList, setCustomerList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  const [backDropOpen, setBackDropOpen] = useState(false);
  
  const loadCustomers = (page) => {
    setBackDropOpen(true);

    fetch(`${backendAddress}/customer/page/${page}`,{
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
    })
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setCustomerList(data.content);
        setPageCount(data.totalPages);
    })
  }

  useEffect(() => {
    loadCustomers(1);
  },[])


  return (
    <>
      {!isDesktop ? <AdminPanelMobileWarning /> : (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3] '><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='bg-[#1E1E1E] h-full mx-2'>
              <div className='flex flex-row text-white mx-5 h-[10%] font-semibold text-[17px]'>
                <div className='flex-[2] flex items-center justify-center '>Customer ID</div>
                <div className='flex-[2] flex items-center justify-center'>First name</div>
                <div className='flex-[2] flex items-center justify-center'>Last name</div>
                <div className='flex-[2] flex items-center justify-center'>Phone no</div>
                <div className='flex-[4] flex items-center'>
                    <p className='ml-3'>Email</p>
                </div>
                <div className='flex-[4] flex items-center'>Address</div> 
              </div>
              <hr className='mb-6 mx-4' />
              <div className='overflow-y-scroll hide-scrollbar h-[86%]'>
        
                {customerList.map((customer) => (
                    <AdminCustomerRow key={customer.customerID} customer={customer}  />
                ))}  
        
                <div className='w-full flex justify-center py-3'>
                  <Pagination 
                    count={pageCount} 
                    onChange={(e, value) => loadCustomers(value)} 
                    sx={{"& .MuiPaginationItem-root": {
                      color: "#fff",
                    }, "& .Mui-selected" : {
                      backgroundColor: "#141414"
                    }}}  
                   /> 
                </div>
              </div>
            </div>
          </div> 
          <MyBackdrop backDropOpen={backDropOpen} /> 
        </div>
      )}
    </>
  )
}

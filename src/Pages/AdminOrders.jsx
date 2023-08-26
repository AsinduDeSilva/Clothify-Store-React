import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Pagination, Tab, Tabs } from '@mui/material'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import AdminOrderRow from '../Components/AdminOrderRow';
import MyBackdrop from '../Components/MyBackdrop';
import isDesktop from '../CheckDevice';
import AdminPanelMobileWarning from '../Components/AdminPanelMobileWarning';

export default function AdminOrders() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const [orderList, setOrderList] = useState([]);
  const [customerNameList, setCustomerNameList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  const [activeCategory, setActiveCategory] = useState(0);
  const [backDropOpen, setBackDropOpen] = useState(false);
  
  const loadOrders = (page) => {
    setBackDropOpen(true)

    fetch(`http://${backendAddress}/order/status/${activeCategory}?page=${page}`,{
        headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`,
        },
    })
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setOrderList(data.content);
        setPageCount(data.totalPages);
        loadCustomerNames();
    })
  }

  useEffect(() => {
    loadOrders(1);
  },[])

  useEffect(() => {
    loadOrders(1);
  },[activeCategory])

  useEffect(() => {
    loadCustomerNames();
  },[orderList])

  async function loadCustomerNames() {
    setCustomerNameList([]);
    setBackDropOpen(true)
  
    const fetchPromises = orderList.map(async (order) => {
      const response = await fetch(`http://${backendAddress}/customer/${order.customerID}`,{
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
        },
      });
      if(response.status === 400) return "Deleted Customer";
      const data = await response.json();
      return data.firstName + " " + data.lastName ;
    });
  
    const customerNamesArray = await Promise.all(fetchPromises);
    setBackDropOpen(false)
    setCustomerNameList(customerNamesArray);
  }
 

  return (
    <>
      {!isDesktop ? <AdminPanelMobileWarning /> : (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3] '><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='h-[13%] flex items-center'>
              <div className='text-white bg-[#1E1E1E] mx-2 py-3 h-[80%] w-full rounded'>
                <Tabs 
                  value={activeCategory} 
                  centered 
                  onChange={(e, newValue) => setActiveCategory(newValue) }  
                  textColor='inherit' 
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#fff"
                    }
                  }}
                >
                  <Tab label="All" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Pending" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Processing" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Out for Delivery" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Delivered" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Cancelled" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                </Tabs> 
              </div>
            </div>
            <div className='h-[87%] mx-2 bg-[#1E1E1E] rounded-t'>
              <div className='flex flex-row text-white mx-5 h-[10%] font-semibold text-[17px]'>
                <div className='flex-[2] flex items-center justify-center '>Order ID</div>
                <div className='flex-[2] flex items-center justify-center'>Customer ID</div>
                <div className='flex-[4] flex items-center'>Customer Name</div>
                <div className='flex-[2] flex items-center justify-center'>Order Date</div>
                <div className='flex-[2] flex items-center justify-center'>Status</div>
                <div className='flex-[2] flex items-center justify-center '>More</div> 
              </div>
              <hr className='mb-4' />
              <div className='h-[86%] overflow-y-scroll hide-scrollbar'>
    
                {orderList.map((order, index) => (
                    <AdminOrderRow key={order.orderID} order={order} customerName={customerNameList[index]} />
                ))}    
    
                <div className='w-full flex justify-center py-3'>
                  <Pagination 
                    count={pageCount} 
                    onChange={(e, value) => loadOrders(value)} 
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

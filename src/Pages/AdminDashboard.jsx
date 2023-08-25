import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Autorenew, CalendarMonth, LocalShipping, MoreHoriz, Today } from '@mui/icons-material'
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import MyBackdrop from '../Components/MyBackdrop';
import isDesktop from '../CheckDevice';
import WeeklySalesChart from '../Components/WeeklySalesChart';

export default function AdminDashboard() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const [orderStats, setOrderStats] = useState({
    incomeOfToday : 0,
    incomeOfYesterday : 0,
    incomeOfLast30Days : 0,
    pendingOrderCount : 0,
    processingOrderCount : 0,
    deliveringOrderCount : 0
  });  
  const [backDropOpen, setBackDropOpen] = useState(false);

  const loadOrderStats = () => {
    setBackDropOpen(true);
    fetch(`http://${backendAddress}/order/stats`, {
        headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`,
        },
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false);
        setOrderStats(data);
      })
  }

  useEffect(() => {
    loadOrderStats();
  }, []);
  return (
    <>
      {!isDesktop ? null : (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3]'><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='bg-[#1E1E1E] h-full mx-2'>
              <div className='w-full h-[32%] flex items-center justify-between text-[#F9FAFB] px-10'>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#0E9F6E] flex flex-col items-center space-y-2'>
                  <Today sx={{fontSize: '30px', mt: '4vh'}}/>
                  <p className='text-lg'>Today Sales</p>
                  <p className='font-semibold text-3xl'>LKR {orderStats.incomeOfToday.toFixed(2)}</p>
                </div>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#0694A2] flex flex-col items-center space-y-2'>
                  <Today sx={{fontSize: '30px', mt: '4vh'}}/>
                  <p className='text-lg'>Yesterday Sales</p>
                  <p className='font-semibold text-3xl'>LKR {orderStats.incomeOfYesterday.toFixed(2)}</p>
                </div>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#FF8A4C] flex flex-col items-center space-y-2'>
                  <CalendarMonth sx={{fontSize: '30px', mt: '4vh'}}/>
                  <p className='text-lg'>Past 30 Days</p>
                  <p className='font-semibold text-3xl'>LKR {orderStats.incomeOfLast30Days.toFixed(2)}</p>
                </div>
              </div>
              <div className='h-[14%] flex justify-between px-10 text-white'>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#141414] flex'>
                  <div className='flex-[1] flex items-center justify-center'>
                    <div className='bg-gray-600 h-[65%] w-[55%] rounded-full flex items-center justify-center'>
                      <Autorenew className='rotate-90' />
                    </div>
                  </div>
                  <div className='flex-[2] flex items-center justify-center'>
                    <div className='h-[65%] w-full flex flex-col justify-between'>
                      <p className='text-sm text-gray-300'>Orders Pending</p>
                      <p className='text-2xl'>{orderStats.pendingOrderCount}</p>
                    </div>
                  </div>
                </div>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#141414] flex'>
                  <div className='flex-[1] flex items-center justify-center'>
                    <div className='bg-gray-600 h-[65%] w-[55%] rounded-full flex items-center justify-center'>
                      <MoreHoriz />
                    </div>
                  </div>
                  <div className='flex-[2] flex items-center justify-center'>
                    <div className='h-[65%] w-full flex flex-col justify-between'>
                      <p className='text-sm text-gray-300'>Orders Processing</p>
                      <p className='text-2xl'>{orderStats.processingOrderCount}</p>
                    </div>
                  </div>
                </div>
                <div className='h-[76%] w-[26%] rounded-xl bg-[#141414] flex'>
                  <div className='flex-[1] flex items-center justify-center'>
                    <div className='bg-gray-600 h-[65%] w-[55%] rounded-full flex items-center justify-center'>
                      <LocalShipping />
                    </div>
                  </div>
                  <div className='flex-[2] flex items-center justify-center'>
                    <div className='h-[65%] w-full flex flex-col justify-between'>
                      <p className='text-sm text-gray-300'>Orders Out for Delivery</p>
                      <p className='text-2xl'>{orderStats.deliveringOrderCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='h-[52%] mx-10 flex items-center justify-center'>
                <div className='w-[60%] h-full bg-[#141414] rounded-lg'>
                  <p className='text-white font-medium p-4'>Weekly Sales</p>
                  <div className='-mt-2'>
                    <WeeklySalesChart />
                  </div>
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

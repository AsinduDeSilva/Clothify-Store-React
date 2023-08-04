import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import logo from '../assets/logo-transparent.png';
import { Facebook, Instagram, Twitter, WhatsApp } from '@mui/icons-material';

export default function Footer() {
  return (
    <div className=' bg-[#D9D9D9] overflow-hidden'>
        <Grid container spacing={2} >
          <Grid xs={12} lg={3}>
            <div className='xl:h-[200px] sm:h-[150px] h-[130px] flex items-center justify-center '>
              <img src={logo} alt="logo" className='xs:h-[70px] h-[60px] p-1' />
            </div>
          </Grid>
          <Grid xs={12} sm={4} lg={3}>
            <div className='xl:mt-10 ml-12 md:ml-16'>
              <span className='font-semibold xl:text-lg xs:text-lg'>Contact Us</span><br />
              <a href="https://wa.me/+94767390760">
                <WhatsApp fontSize='large' className='mr-3 mt-4 hover:text-green-600 transition-time '/>
              </a>
              <a href="">
                <Facebook fontSize='large' className='mr-3 mt-4 hover:text-blue-700'/>
              </a>
              <a href="">
                <Instagram fontSize='large' className='mr-3 mt-4 hover:text-pink-700'/>
              </a>
              <a href="">
                <Twitter fontSize='large' className='mt-4 hover:text-blue-400'/>
              </a>

            </div>
          </Grid>
          <Grid xs={12} sm={4} lg={3}>
            <div className='xl:mt-10 ml-12 sm:ml-0'>
              <span className='font-semibold xl:text-lg xs:text-lg '>Openning Hours</span><br />
              <div className='mt-5 xl:text-[15px] xs:text-sm text-xs'>
                <p >Monday to Friday : 9.00 am to 5.00pm</p>
                <p className='mt-1'>Saturday : 9.00 am to 2.00pm</p>
              </div>
            </div>
          </Grid>
          <Grid xs={12} sm={4} lg={3}>
          <div className='xl:mt-10 ml-12 sm:ml-0'>
              <span className='font-semibold xs:text-lg'>Company Details</span><br />
              <div className='mt-5 xl:text-[15px] xs:text-sm text-xs'>
                <p>Name : Clothify Store (PVT) Ltd.</p>
                <p className='mt-1'>Address : No.34, Horana Road, Panadura.</p>
                <p className='mt-1'>Email : sales@clothifystore.lk</p>
              </div>
            </div>
          </Grid>
          <Grid xs={12} >
            <div className='bg-black text-white border-t py-3 border-black flex justify-center xl:text-md xs:text-sm text-xs'>
              © {new Date().getFullYear()} Clothify Store. All rights reserved.
            </div>
          </Grid>
        </Grid>
      </div>
  )
}

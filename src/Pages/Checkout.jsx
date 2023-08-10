import React from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import Footer from '../Components/Footer';

export default function Checkout() {
  return (
    <div>
        <Navbar/>
        <Heading name="Checkout" />

        

        <Grid container spacing={0} sx={{mb:5}}> 
          <Grid item xs={12} lg={6} className="border-r-2" >
            <Container component="main" maxWidth="sm" >
              <h1 className='font-medium mb-4'>Contact Information</h1>
              <TextField  label="Email" variant="outlined" fullWidth   />
              <h1 className='font-medium my-4'>Shipping Information</h1>
              <Grid container spacing={2} >
                  <Grid item xs={12} sm={6}>
                      <TextField  label="First name" variant="outlined" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <TextField  label="Last name" variant="outlined" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField  label="Address" variant="outlined" fullWidth multiline />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField  label="Phone " variant="outlined" fullWidth />
                  </Grid>
              </Grid>
            </Container>
          </Grid>

          <Grid item xs={12} lg={6} className="mt-5 xl:mt-0" >
            <Container component="main" maxWidth="sm" sx={{px:3}} >
              <div className='flex justify-between items-center mb-2 text-gray-700 text-[14px]'>
                <p>Sub Total</p>
                <p>LKR 9000.00</p>
              </div>
              <div className='flex justify-between items-center mb-2 text-gray-700 text-[14px]'>
                <p>Shipping</p>
                <p>LKR 500.00</p>
              </div>
              <hr />
              <div className='flex justify-between items-center mb-5 mt-3 text-[18px]'>
                <p className='font-medium'>Total</p>
                <p className='font-medium'>LKR 9500.00</p>
              </div>   
              <div className='flex justify-end items-center'>
                <Button 
                  variant="contained" 
                  size={window.innerWidth > 350 ? 'medium' : 'medium'}
                  sx={btnStyle1}  
                  fullWidth         
                >
                    Place Order
                </Button>
              </div>   
            </Container>
          </Grid>
        </Grid>
        <Footer />
    </div>
  )
}

const btnStyle1 ={
  backgroundColor:'black',
  ":hover":{
    backgroundColor:"black"
  }
}

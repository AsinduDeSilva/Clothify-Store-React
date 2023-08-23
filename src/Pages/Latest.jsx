import React, { useEffect, useState } from 'react'
import {Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../Components/Navbar';
import Heading from '../Components/Heading';
import ProductListView from '../Components/ProductListView';
import Footer from '../Components/Footer';


export default function Latest() {
  const [productList, setProductList] = useState([]);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const {backendAddress} = useSelector(state => state.backendInfo);
  
  useEffect(()=>{
    loadProducts();
  },[]); 

  const loadProducts = () =>{

    setBackDropOpen(true);

    fetch(`http://${backendAddress}/product/category/all?page=1`)
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setProductList(data.content);
    })
  }

  return (
    <div>
      <Navbar/>
      <Heading name="Latest" />
      <ProductListView products={productList} />

      <Footer />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}   
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
    </div>
  )
}

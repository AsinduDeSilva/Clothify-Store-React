import React, { useEffect, useState } from 'react'
import ProductListView from './ProductListView'
import {Backdrop, CircularProgress, Pagination } from '@mui/material';
import Heading from './Heading';
import Footer from './Footer';
import Navbar from './Navbar';


export default function ProductCategoryView(props) {
  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  const [backDropOpen, setBackDropOpen] = useState(false);
  
  useEffect(()=>{
    loadProducts(1);
  },[]); 

  const loadProducts = (page) =>{

    setBackDropOpen(true);

    fetch(`http://192.168.1.20:8080/product/category/${props.category}?page=${page}`)
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setProductList(data.content);
        setPageCount(data.totalPages);
    })
  }

  const handleChange = (event, value) => {
    loadProducts(value);
  };

  return (
    <div>
      <Navbar/>
      <Heading name={props.name} />
      <ProductListView products={productList} />

      <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 pb-10 flex justify-center'>
        <Pagination count={pageCount} onChange={handleChange} size={window.innerWidth > 350 ? 'medium' : 'small' } /> 
      </div>

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

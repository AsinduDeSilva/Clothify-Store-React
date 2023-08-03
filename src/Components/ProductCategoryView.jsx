import React, { useEffect, useState } from 'react'
import ProductListView from './ProductListView'
import {Pagination } from '@mui/material';
import Heading from './Heading';
import Footer from './Footer';


export default function ProductCategoryView(props) {
  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  
  useEffect(()=>{
    console.log("useEffect");
    loadProducts(1);
  },[]); 

  const loadProducts = (page) =>{
    console.log("test")
    fetch(`http://192.168.1.20:8080/product/category/${props.category}?page=${page}`)
     .then(res => res.json())
     .then(data => {
        setProductList(data.content);
        setPageCount(data.totalPages);
    })
  }

  const handleChange = (event, value) => {
    loadProducts(value);
  };

  return (
    <div>
      <Heading name={props.name} />
      <ProductListView products={productList} />

      <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 pb-10 flex justify-center'>
        <Pagination count={pageCount} onChange={handleChange} size={window.innerWidth > 900 ? 'large' : window.innerWidth > 350 ? 'medium' : 'small' } /> 
      </div>

      <Footer />
      
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import CategoryPreview from '../Components/CategoryPreview'
import { HomeCarousel } from '../Components/HomeCarousel'
import { useSelector } from 'react-redux'
import ProductListView from '../Components/ProductListView'
import { Backdrop, CircularProgress } from '@mui/material'


export default function Homepage() {
  const [productList, setProductList] = useState([]);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const {backendAddress} = useSelector(state => state.backendInfo);
  
  useEffect(()=>{
    loadProducts();
  },[]); 

  const loadProducts = () =>{

    setBackDropOpen(true);

    fetch(`${backendAddress}/product/category/all?page=1`)
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        let productList = [];
        if(data.content?.length >= 4){
          for(let i=0; i<4; i++){
            productList.push(data.content[i]);
          }
          setProductList(productList);
        }
    })
  }

  return (
    <div>
      <Navbar/>
      <HomeCarousel/>
      <CategoryPreview/>


      <div className=" xl:pt-20 lg:max-w-[1450px] xl:mx-auto xl:px-8">
        <h2 className="ml-4 sm:ml-6 md:ml-8 xl:ml-0 text-2xl pb-8 font-extrabold tracking-tight text-gray-900">New Arrivals</h2>
      </div>
  
      <ProductListView products={productList} />

      <Footer/>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}   
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

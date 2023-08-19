import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import CategoryPreview from '../Components/CategoryPreview'
import { Button } from '@material-tailwind/react'
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

    fetch(`http://${backendAddress}/product/page/1`)
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        let productList = [];
        for(let i=0; i<4; i++){
          productList.push(data.content[i])
        }
        setProductList(productList);
    })
  }

  return (
    <div>
      <Navbar/>
      <HomeCarousel/>
      <CategoryPreview/>

      <div className='w-full pb-5 mt-4 bg-gradient-to-br from-[#141414] to-[#5E5E5E]'>
        <div className='text-white text-3xl flex justify-center py-10 font-semibold'>New Arrivals</div>
        <ProductListView products={productList} />
      </div>

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

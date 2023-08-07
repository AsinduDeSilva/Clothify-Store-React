import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar';
import Grid from '@mui/material/Unstable_Grid2';
import Footer from '../Components/Footer';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/userInfo';


export default function AddToCart() {
  const productID = useParams().productID;
  const [productData, setProductData] = useState({
    productID: 0,
    name: "",
    unitPrice: 0,
    largeQty: 0,
    mediumQty: 0,
    smallQty: 0,
    category: "",
    imgFileName: ""
  });
  const [qty, setQty] = useState(0);
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  

  useEffect(() =>{
    loadProductDeatils();
  },[])

  const loadProductDeatils = () => {
    fetch(`http://192.168.1.20:8080/product/${productID}`)
     .then(res => res.json())
     .then(data => setProductData(data))
  }

  const qtyOnHandOf = (size) => {
    switch (size){
      case "SMALL" : return productData.smallQty;
      case "MEDIUM" : return productData.mediumQty;
      case "LARGE" : return productData.largeQty;
      default : return 0;
    }
  }
  
  const increment = () => {
    if(qty === qtyOnHandOf(size))return;   
    setQty(prev => ++prev)
  }

  const decrement = () => {
    if(qty === 0)return;
    setQty(prev => --prev)
  }

  const addToCartBtnClicked = () => {
    if (qty === 0 )return;
    dispatch(addToCart({
      productID: productID,
      size: size,
      qty: qty 
    }))
  }

  const buyNowBtnClicked = () => {
    
  }

  return (
    <div className='overflow-hidden'>
        <Navbar/>
        
        <Grid container >
            <Grid xs={12} md={6}  >
                <div className='md:h-[500px] h-[400px] flex items-center justify-center md:my-10 '>
                  <div className='h-[90%] rounded-[20px] shadow-xl hover:shadow-2xl transition-time overflow-hidden'>
                    <img 
                      src={productData.imgFileName === "" ? null : "http://192.168.1.20:8080/product/image/"+productData.imgFileName} 
                      alt="product" 
                      className='w-full h-full hover:scale-110 transition-time' 
                    />
                  </div>
                </div>
            </Grid>
            <Grid xs={12} md={6} >
                <div className='md:h-[500px] h-[400px] mb-10 md:my-10 md:ml-10 md:scale-110 flex items-center md:justify-normal justify-center border-t-4 md:border-none '>
                  <div className='h-[80%]'>
                    <p className='text-4xl font-semibold'>{productData.name}</p>
                    <p className='text-lg font-medium text-gray-600 mt-4 mb-6' >
                      LKR {productData.unitPrice.toFixed(2)}
                    </p>
                    <p className='font-medium text-md mb-4'>Size</p>

                    <div className='flex mb-6'>
                      <div className='ml-5'>
                        <Button 
                          disabled={productData.smallQty === 0 ? true : false}
                          size='small'
                          variant="contained" 
                          onClick={e => {setSize("SMALL");setQty(0)}} 
                          sx={size === "SMALL" ? btnStyle1 : btnStyle2}
                        >
                          Small
                        </Button>
                      </div>
                      <div className='ml-3'>
                        <Button
                          disabled={productData.mediumQty === 0 ? true : false}
                          size='small'
                          variant="contained" 
                          onClick={e => {setSize("MEDIUM");setQty(0)}}
                          sx={size === "MEDIUM" ? btnStyle1 : btnStyle2}
                        >
                          Medium
                        </Button>
                      </div>
                      <div className='ml-3'>
                        <Button 
                          disabled={productData.largeQty === 0 ? true : false}
                          size='small'
                          variant="contained" 
                          onClick={e => {setSize("LARGE");setQty(0)}}
                          sx={size === "LARGE" ? btnStyle1 : btnStyle2}
                        >
                          Large
                        </Button>
                      </div>
                    </div>

                    <p className='font-medium'>Quantity</p>

                    <div className='flex '>
                      <div className='flex h-8 w-24 bg-[#fff] rounded border border-black ml-5 mt-4 mb-10'>
                        <div className='w-8 flex items-center justify-center'>
                          <button className="font-semibold" onClick={e => decrement()}> - </button>
                        </div>
                        <div className='flex w-8 items-center justify-center'> {qty} </div>
                        <div className='w-8 flex items-center justify-center'>
                          <button className="font-semibold" onClick={e => increment()}> + </button>
                        </div>
                      </div>
                      
                      <span className='mt-6 ml-2 text-xs'>
                        {size !== "" ? qtyOnHandOf(size)+" left" : null}
                      </span>
                      
                    </div>
                    

                    <div className='flex'>
                      <div className=' mr-2'>
                        <Button 
                          variant="contained" 
                          size='large'
                          sx={btnStyle1}
                          onClick={e => addToCartBtnClicked()}
                        >
                          Add to cart
                        </Button>
                      </div>
                      <div>
                        <Button 
                          variant="contained" 
                          size='large' 
                          sx={{
                            backgroundColor:'white',
                            color:'black',
                            border:'1px solid black',
                            width:'147px',
                            borderRadius:'25px', 
                            ":hover":{
                              backgroundColor:"white"
                            }
                          }}
                          onClick={e => buyNowBtnClicked()}
                        >
                          Buy now
                        </Button>
                      </div>
                    </div>
                    
                  </div>  
                </div>
            </Grid>
        </Grid>

        <Footer/>
        
    </div>
  )
}

const btnStyle1 ={
  backgroundColor:'black',
  border:'1px solid black',
  borderRadius:'25px',
  ":hover":{
    backgroundColor:"black"
  }
}

const btnStyle2 = {
  backgroundColor:'white',
  color:'black',
  border:'1px solid black',
  borderRadius:'25px', 
  ":hover":{
    backgroundColor:"white"
  }
}

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar';
import Grid from '@mui/material/Unstable_Grid2';
import Footer from '../Components/Footer';
import { Alert, Button, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import MyBackdrop from '../Components/MyBackdrop';
import { addToCart, updateCart } from '../Redux/userInfo';


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
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSettings, setSnackbarSettings] = useState({message: null, type: null});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {isCustomer, isAdmin, cart, jwt, customerID} = useSelector(state => state.userInfo);
  

  useEffect(() =>{
    loadProductDeatils();
  },[])

  const loadProductDeatils = () => {
    setBackDropOpen(true)
    fetch(`${backendAddress}/product/${productID}`)
     .then(res => res.json())
     .then(data => {
       setBackDropOpen(false)
       setProductData(data)
      })
  }

  const addToServerCart = async (cartItem) => {
    setBackDropOpen(true);
    await fetch(`${backendAddress}/customer/cart/${customerID}`,{  
      method: 'POST',
      body: JSON.stringify(cartItem),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
  }

  const updateServerCart = async (cartItem, index) => {
    setBackDropOpen(true);
    await fetch(`${backendAddress}/customer/cart/${customerID}?index=${index}`,{  
      method: 'PUT',
      body: JSON.stringify(cartItem),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
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
    if(size === "" ){
      setSnackbarSettings({message: "Please select a size", type: "error"});
      setSnackbarOpen(true);
      return;
    }
    if(qty === qtyOnHandOf(size)){
      setSnackbarSettings({message: "You have selected the available quantity", type: "error"});
      setSnackbarOpen(true);
      return;
    };   
    setQty(prev => ++prev)
  }

  const decrement = () => {
    if(qty === 0)return;
    setQty(prev => --prev)
  }

  const addToCartBtnClicked = async () => {
    if (qty === 0 ){
      setSnackbarSettings({message: "Please select a quantity", type: "error"});
      setSnackbarOpen(true);
      return;
    } 
    
    const existingCartItemIndex = cart.findIndex(

    cartItem => cartItem.productID == productID && cartItem.size === size);

    const cartItem = {
      productID: productID,
      size: size,
      quantity: qty
    }

    if (existingCartItemIndex !== -1) {
      if(isCustomer){
        await updateServerCart(cartItem, existingCartItemIndex);
      }
      dispatch(updateCart({
        index: existingCartItemIndex, 
        data : cartItem
      }));
      setSnackbarSettings({message: "Cart Updated", type: "success"});
      setSnackbarOpen(true);
      return;
    }

    if(isCustomer){
      await addToServerCart(cartItem);
    }
    
    dispatch(addToCart(cartItem))
    setSnackbarSettings({message: "Added to cart", type: "success"});
    setSnackbarOpen(true);
  }

  const buyNowBtnClicked = () => {
    if (qty === 0 ){
      setSnackbarSettings({message: "Please select a quantity", type: "error"});
      setSnackbarOpen(true);
      return;
    }  
    !isCustomer ? navigate("/login") : navigate("/checkout", {state: {cart:[{
      productID: productID,
      size: size,
      quantity: qty 
    }]}})
  }

  return (
    <>
    {isAdmin ? null : (
      <div className='overflow-hidden'>
        <Navbar/>
        
        <Grid container >
            <Grid xs={12} md={6}  >
                <div className='md:h-[500px] h-[400px] flex items-center justify-center md:my-10 '>
                  <div className='h-[90%] rounded-[20px] shadow-xl hover:shadow-2xl transition-time overflow-hidden'>
                    <img 
                      src={productData.imgFileName === "" ? null : `${backendAddress}/product/image/${productData.imgFileName}`} 
                      alt="product" 
                      className='w-full h-full hover:scale-110 transition-time' 
                      />
                  </div>
                </div>
            </Grid>
            <Grid xs={12} md={6} >
                <div className='md:h-[500px] h-[400px] mb-10 md:my-10 md:ml-10 md:scale-110 flex items-center md:justify-normal justify-center'>
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

                    <div className='flex'>
                      <div className='flex h-8 w-24 bg-[#fff] rounded border border-black ml-5 mt-4 mb-10'>
                        <div className='w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer'>
                          <button className="font-semibold" onClick={e => decrement()}> - </button>
                        </div>
                        <div className='flex w-8 items-center justify-center'> {qty} </div>
                        <div className='w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer'>
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
                              backgroundColor:"#212529",
                              color: 'white'
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

        <MyBackdrop backDropOpen={backDropOpen} />
                          
        <Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={e => setSnackbarOpen(false)} anchorOrigin={{vertical: 'top', horizontal:'right'}}>
          <Alert severity={snackbarSettings.type} sx={{ width: '100%' }}>
            {snackbarSettings.message}
          </Alert>
        </Snackbar>
        
      </div>
    )}
    </>
  )
}

const btnStyle1 ={
  backgroundColor:'#212529',
  border:'1px solid black',
  borderRadius:'25px',
  ":hover":{
    backgroundColor:"#000000"
  }
}


const btnStyle2 = {
  backgroundColor:'white',
  color:'black',
  border:'1px solid black',
  borderRadius:'25px', 
  ":hover":{
    backgroundColor:"black",
    color: 'white'
  }
}

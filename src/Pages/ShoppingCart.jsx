import React, { useEffect, useState } from 'react';
import Heading from '../Components/Heading';
import Navbar from '../Components/Navbar';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import MyBackdrop from '../Components/MyBackdrop';
import { removeFromCart, setCart, updateCart } from '../Redux/userInfo';
import Cookies from 'js-cookie';

export default function ShoppingCart() {

  const {cart, isAdmin, isCustomer, customerID, jwt} = useSelector((state) => state.userInfo);   
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [productDetailsList, setProductDetailsList] = useState([]); 
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSettings, setSnackbarSettings] = useState({message: null, type: null});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadProducts = async () => {
    setProductDetailsList([]);
    const productIdArray = cart.map(cartItem => cartItem.productID);

    if (productIdArray.length === 0) return;

    setBackDropOpen(true)
    const response = await fetch(`${backendAddress}/product/list`, {
      method: 'POST',
      body: JSON.stringify(productIdArray),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
    setBackDropOpen(false)
    const productDetails = await response.json();
    const productDetailsArray = cart.map(cartItem => productDetails.find(productDetail => productDetail.productID == cartItem.productID));
    
    await validateCart(productDetailsArray);
    setProductDetailsList(productDetailsArray);
  }

  const updateServerCart = async (cartItem, index) => {
    setBackDropOpen(true);
    const response = await fetch(`${backendAddress}/customer/cart/${customerID}?index=${index}`,{  
      method: 'PUT',
      body: JSON.stringify(cartItem),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
    return response;
  }

  const removeFromServerCart = async (indexesToRemoveArray) => {
    setBackDropOpen(true);
    const response = await fetch(`${backendAddress}/customer/cart/${customerID}`,{  
      method: 'DELETE',
      body: JSON.stringify(indexesToRemoveArray),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
    return response;
  }

  const setServerCart = async (cart) => {
    setBackDropOpen(true);
    const response = await fetch(`${backendAddress}/customer/cart/set/${customerID}`,{  
      method: 'Post',
      body: JSON.stringify(cart),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
    return response;
  }
  

  const validateCart = async (productDetailsArray) => {
    const indexesToRemove = [];

    for (let i = 0; i < productDetailsArray.length; i++) {
      if (productDetailsArray[i] === undefined || cart[i].qty > qtyOnHand(cart[i].size, productDetailsArray[i])) {
        indexesToRemove.push(i);
      }
    }

    if(indexesToRemove.length === 0) return;
 
    let tempCart = [...cart]; 
    for (let i = indexesToRemove.length - 1; i >= 0; i--) {
      productDetailsArray.splice(indexesToRemove[i], 1);
      tempCart.splice(indexesToRemove[i], 1);
    }
    
    if (isCustomer){
      const response = await setServerCart(tempCart);
      if(!response.ok){
        setSnackbarSettings({message: "Something went wrong", type: "error"});
        setSnackbarOpen(true);
        return;
      }
    }else{
      Cookies.set('cart', JSON.stringify(tempCart));
    }

    dispatch(setCart(tempCart));
  }

  const qtyOnHand = (size, productData) => {
    switch (size){
      case "SMALL" : return productData.smallQty;
      case "MEDIUM" : return productData.mediumQty;
      case "LARGE" : return productData.largeQty;
      default : return 0;
    }
  }

  useEffect(() => {
    loadProducts();
  },[])

  const removefromCart = async (index) => {
    let tempCart = [...cart];
    productDetailsList.splice(index,1);
    tempCart.splice(index, 1);
    dispatch(setCart(tempCart));

    if(isCustomer){
      const response = await removeFromServerCart([index]);
      if(!response.ok){
        setSnackbarSettings({message: "Something went wrong", type: "error"});
        setSnackbarOpen(true);
        return;
      }
    }else{
      Cookies.set('cart', JSON.stringify(tempCart));
    }

    setSnackbarSettings({message: "Removed", type: "success"});
    setSnackbarOpen(true);
  }

  const getTotal = () => {
    let total = 0;
    cart.forEach((cartItem, index) => {
        total += cartItem.quantity * productDetailsList[index]?.unitPrice;
    })
    return total;
  }

  const qtyOnHandOf = (index,size) => {
    switch (size){
      case "SMALL" : return productDetailsList[index].smallQty;
      case "MEDIUM" : return productDetailsList[index].mediumQty;
      case "LARGE" : return productDetailsList[index].largeQty;
      default : return 0;
    }
  }

  const incremnet = async (index) => {
    if(qtyOnHandOf(index,cart[index].size) === cart[index].quantity){
      setSnackbarSettings({message: "You have selected the maximum quantity", type: "warning"});
      setSnackbarOpen(true);
      return;
    }  

    const cartItem = {
      productID: cart[index].productID,
      size: cart[index].size,
      quantity: cart[index].quantity + 1
    }

    if(isCustomer){
      const response = await updateServerCart(cartItem, index);
      if(!response.ok){
        setSnackbarSettings({message: "Something went wrong", type: "error"});
        setSnackbarOpen(true);
        return;
      }
    }

    dispatch(updateCart({
      index: index, 
      data : cartItem
    }));
  }

  const decremnet = async (index) => {
    if(cart[index].quantity === 1) return;

    const cartItem = {
      productID: cart[index].productID,
      size: cart[index].size,
      quantity: cart[index].quantity - 1
    }

    if(isCustomer){
      const response = await updateServerCart(cartItem, index);
      if(!response.ok){
        setSnackbarSettings({message: "Something went wrong", type: "error"});
        setSnackbarOpen(true);
        return;
      }
    }

    dispatch(updateCart({
      index: index, 
      data : cartItem
    }));
  }

  const btnCheckoutOnClick = () => {
    isCustomer ? navigate("/checkout") : navigate("/login", {state: {fromCart: true, cart}});
  }

    
  return (
    <div>
       {isAdmin ? null : (
          <>
            <Navbar />
            <Heading name="Your Cart"/>

            {cart.length !== 0 ? (
                <>
                <div className=' sm:w-[80%] mx-auto sm:px-8 px-6 lg:px-10 xl:px-20'>
                    <h2 className="sr-only">Items in your shopping cart</h2>

                    <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                    {cart.map((cartItem, index) => (
                        <li key={index} className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0">
                            <img
                              src={productDetailsList[index] !== undefined ? `${backendAddress}/product/image/${productDetailsList[index].imgFileName}` : null}
                              alt={"product"}
                              className="w-24 h-24 rounded-lg object-center object-cover sm:w-32 sm:h-32"
                            />
                        </div>

                        <div className="relative ml-4 flex-1 flex flex-col justify-between md:ml-6">
                            <div>
                            <div className="flex justify-between md:grid md:grid-cols-2">
                                <div className="pr-6">
                                <h3 className="text-sm">
                                    <Link to={"/products/"+cartItem.productID} className="font-medium text-gray-700 hover:text-gray-800">
                                        {productDetailsList[index]?.name}
                                    </Link>
                                </h3>
                                
                                <p className="mt-1 text-sm text-gray-500">{"LKR "+productDetailsList[index]?.unitPrice?.toFixed(2)}</p> 
                                <p className="mt-1 text-sm text-gray-500">{cartItem.size}</p> 
                                </div>

                                <p className="text-sm font-medium text-gray-900 text-right">
                                    {"LKR "+(productDetailsList[index]?.unitPrice * cartItem.quantity).toFixed(2) }</p>
                            </div>

                            <div className="mt-4 flex items-center md:block md:absolute md:top-0 md:left-1/2 md:mt-0 "> 

                                <div className='flex h-8 w-24 bg-[#fff] rounded border border-black md:scale-100 scale-90 -ml-1 md:ml-0'>
                                    <div className='w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer'  onClick={e => decremnet(index)}>
                                        <div className="font-semibold"> - </div>
                                    </div>
                                    <div className='flex w-8 items-center justify-center'> {cartItem.quantity} </div>
                                    <div className='w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer' onClick={e => incremnet(index)}>
                                        <div className="font-semibold"> + </div>
                                    </div>
                                </div>  

                                <button
                                  type="button"
                                  className="hidden md:block text-gray-500 text-sm font-light md:ml-4 sm:mt-3 hover:underline"
                                  onClick={e => removefromCart(index)}
                                >
                                <span>Remove</span>
                                </button> 

                                <div className='absolute -right-2 md:hidden'>
                                    <IconButton onClick={e => removefromCart(index)}>
                                        <Delete className=' text-sm font-medium text-black'/>
                                    </IconButton>
                                </div>

                            </div>
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>

                <div className='sm:w-[80%] mx-auto sm:px-8 px-6 lg:px-10 xl:px-20 my-10 flex items-center justify-between'>
                    <Button 
                        variant="contained" 
                        size={window.innerWidth > 350 ? 'large' : 'medium'}
                        sx={btnStyle1}  
                        onClick={btnCheckoutOnClick}         
                        >
                          Checkout
                    </Button>

                    <p className='text-lg xs:text-2xl font-semibold'>{"LKR "+getTotal().toFixed(2)}</p>
                </div>
            </>
            ) : (
                <div className='sm:w-[80%] h-[250px] mx-auto sm:px-8 px-6 lg:px-10 xl:px-20 my-10 flex items-center justify-center'>
                    <p className='text-lg'>Your cart is empty</p>
                </div>   
            )}

            <Footer/>

            <Snackbar 
              open={snackbarOpen} 
              autoHideDuration={1500} 
              onClose={e => setSnackbarOpen(false)} 
              anchorOrigin={{vertical: 'top', horizontal:'right'}}
              style={{ top: '100px' }}
            >
              <Alert severity={snackbarSettings.type} sx={{ width: '100%' }}>
                {snackbarSettings.message}
              </Alert>
            </Snackbar>

            <MyBackdrop backDropOpen={backDropOpen} />
          </>
       )} 
    </div>
  )
}

const btnStyle1 ={
    backgroundColor:'#212529',
    border:'1px solid black',
    borderRadius:'25px',
    ":hover":{
      backgroundColor:"black"
    }
}

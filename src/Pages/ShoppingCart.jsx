import React, { useEffect, useState } from 'react';
import Heading from '../Components/Heading';
import Navbar from '../Components/Navbar';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../Redux/userInfo';
import { Link } from 'react-router-dom';

export default function ShoppingCart() {

  const {cart} = useSelector((state) => state.userInfo);   
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [productDetailsList, setProductDetailsList] = useState([]); 
  const dispatch = useDispatch();

  async function loadProducts() {
    setProductDetailsList([]);
  
    const fetchPromises = cart.map(async (cartItem) => {
      const response = await fetch(`http://${backendAddress}/product/${cartItem.productID}`);
      const data = await response.json();
      return data;
    });
  
    const productDetailsArray = await Promise.all(fetchPromises);
  
    setProductDetailsList(productDetailsArray);
  }

  useEffect(() => {
    loadProducts();
  },[])

  const checkOutBtnClicked = () => {
    console.log(productDetailsList)
  }

  const removefromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index,1);
    dispatch(updateCart(updatedCart))

    productDetailsList.splice(index,1)
    
  }

  const getTotal = () => {
    let total = 0;
    cart.forEach((cartItem, index) => {
        total += cartItem.qty * productDetailsList[index]?.unitPrice;
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

  const incremnet = (index) => {
    if(qtyOnHandOf(index,cart[index].size) === cart[index].qty)return;

    const cartDetail = cart[index];

    let updatedCart = [...cart];
    updatedCart[index] = {
        productID: cartDetail.productID,
        size: cartDetail.size,
        qty: cartDetail.qty + 1
    };
    

    dispatch(updateCart(updatedCart))
  }

  const decremnet = (index) => {
    if(cart[index].qty == 1) return;
 
    const cartDetail = cart[index];

    let updatedCart = [...cart];
    updatedCart[index] = {
        productID: cartDetail.productID,
        size: cartDetail.size,
        qty: cartDetail.qty - 1
    };

    dispatch(updateCart(updatedCart))
  }

    
  return (
    <div>
        <Navbar />
        <Heading name="Shopping Cart"/>

        {cart.length !== 0 ? (
            <>
            <div className=' sm:w-[80%] mx-auto sm:px-8 px-6 lg:px-10 xl:px-20'>
                <h2 className="sr-only">Items in your shopping cart</h2>

                <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {cart.map((cartItem, index) => (
                    <li key={index} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                        <img
                        src={productDetailsList[index] !== undefined ? `http://${backendAddress}/product/image/${productDetailsList[index].imgFileName}` : null}
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
                            
                            <p className="mt-1 text-sm text-gray-500">{"LKR "+productDetailsList[index]?.unitPrice.toFixed(2)}</p> 
                            <p className="mt-1 text-sm text-gray-500">{cartItem.size}</p> 
                            </div>

                            <p className="text-sm font-medium text-gray-900 text-right">
                                {"LKR "+(productDetailsList[index]?.unitPrice * cartItem.qty).toFixed(2) }</p>
                        </div>

                        <div className="mt-4 flex items-center md:block md:absolute md:top-0 md:left-1/2 md:mt-0 "> 

                            <div className='flex h-8 w-24 bg-[#fff] rounded border border-black md:scale-100 scale-90 -ml-1 md:ml-0'>
                                <div className='w-8 flex items-center justify-center'>
                                    <button className="font-semibold" onClick={e => decremnet(index)}> - </button>
                                </div>
                                <div className='flex w-8 items-center justify-center'> {cartItem.qty} </div>
                                <div className='w-8 flex items-center justify-center'>
                                    <button className="font-semibold" onClick={e => incremnet(index)}> + </button>
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
                    onClick={checkOutBtnClicked}            
                    >
                    Check out
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
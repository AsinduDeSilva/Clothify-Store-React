import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { Button, Container, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { updateCart } from '../Redux/userInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import MyBackdrop from '../Components/MyBackdrop';
import Swal from 'sweetalert2';

const SHIPPING_FEE = 500.00;

export default function Checkout() {

  const {customerID, isCustomer} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {cart} = useSelector((state) => state.userInfo);  
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const tempCart = useLocation().state?.cart;
  const [customerDetails, setCustomerDetails] = useState({});
  const [productDetailsList, setProductDetailsList] = useState([]); 
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [backDropOpen, setBackDropOpen] = useState(false);
  
  const [txtFirstNameError, setTxtFirstNameError] = useState(false);
  const [txtLastNameError, setTxtLastNameError] = useState(false);
  const [txtAddressError, setTxtAddressError] = useState(false);
  const [txtPhoneNoError, setTxtPhoneNoError] = useState(false);
  const [checkoutCart, setCheckoutCart] = useState(cart);

  useEffect(() => {
    if(isCustomer){
      if(tempCart != undefined){
        setCheckoutCart(tempCart);
      }
      loadCustomerDetails();
      loadProducts();
    }
  },[checkoutCart])

  const loadCustomerDetails = () =>{
    setBackDropOpen(true)
    fetch(`http://${backendAddress}/customer/${customerID}`,{  
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      setBackDropOpen(false)  
      setEmail(data.user.email)
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setAddress(data.address);
      setPhoneNo(data.mobileNo);
      setCustomerDetails(data);
    })
  }

  async function loadProducts() {
    setProductDetailsList([]);
  
    const fetchPromises = checkoutCart.map(async (cartItem) => {
      const response = await fetch(`http://${backendAddress}/product/${cartItem.productID}`);
      const data = await response.json();
      return data;
    });
  
    const productDetailsArray = await Promise.all(fetchPromises);
    setProductDetailsList(productDetailsArray);
  }

  const getTotal = () => {
    let total = 0;
    checkoutCart.forEach((cartItem, index) => {
        total += cartItem.qty * productDetailsList[index]?.unitPrice;
    })
    return total;
  }

  const total = (getTotal() + SHIPPING_FEE).toFixed(2);

  const btnPlaceOrderOnClick = () => {
    
    if(!checkValidity()) return;

    setBackDropOpen(true);

    if(customerDetails.address === null){
      fetch(`http://${backendAddress}/customer/${customerID}`,{  
      method: 'PUT',
      body: JSON.stringify({
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        address: address,
        mobileNo: phoneNo 
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }})
    }

    let orderDetails = [];
    for(var i=0; i<checkoutCart.length; i++){
      orderDetails.push({
        productID: checkoutCart[i].productID,
        size: checkoutCart[i].size,
        quantity: checkoutCart[i].qty,
        unitPrice: productDetailsList[i].unitPrice
      })
    }

    fetch(`http://${backendAddress}/order/`,{  
      method: 'POST',
      body: JSON.stringify({
        receiverAddress: address,
        receiverMobileNo: phoneNo,
        receiverName: firstName+" "+lastName,
        customerID: customerID,
        shippingFee: SHIPPING_FEE,
        total: total,
        orderDetails: orderDetails,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      setBackDropOpen(false);

      if(data.success){
        Swal.fire({
          title: 'Thank you!',
          text: 'Your order has been placed',
          icon: 'success',
          confirmButtonColor: '#636C74',
        })
        dispatch(updateCart([]));
        Cookies.remove('cart');
        navigate("/", {replace: true})
        
      }else if (data.message === "Some products not found") {
        Swal.fire({
          title: 'Order Failed!',
          text: data.message + ". Please check your cart again.",
          icon: 'error',
          confirmButtonColor: '#636C74',
        })
      }else{
        Swal.fire({
          title: 'Order Failed!',
          text: data.message + ". Please check your cart again.",
          icon: 'error',
          confirmButtonColor: '#636C74',
        })
      }

    })
  }

  const checkValidity = () => {

    setTxtFirstNameError(false);
    setTxtLastNameError(false);
    setTxtAddressError(false);
    setTxtPhoneNoError(false);

    let isValid = true;
    if(firstName === ""){
      setTxtFirstNameError(true);
      isValid = false;
    }

    if(lastName === ""){
      setTxtLastNameError(true);
      isValid = false;
    }

    if(address === "" || address === null){
      setTxtAddressError(true);
      isValid = false;
    }

    if(!phoneNo?.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
      setTxtPhoneNoError(true);
      isValid = false;
    }

    return isValid;
  }


  return (
    <div>
        {
          checkoutCart.length === 0 || !isCustomer ? null : (
            <>
              <Navbar/>
              <Heading name="Checkout" />

              <Grid container spacing={0} sx={{mb:5}}> 
                <Grid xs={12} lg={6} className="border-r-2" >
                  <Container component="main" maxWidth="sm" >
                    <h1 className='font-medium text-[18px] mb-6'>Contact Information</h1>
                    <TextField  
                      disabled
                      label="Email" 
                      variant="outlined" 
                      fullWidth 
                      value={email}
                      InputProps={{
                        readOnly: true,
                      }}   
                    />
                    <h1 className='font-medium text-[18px] my-6'>Shipping Information</h1>
                    <Grid container spacing={2} >
                        <Grid xs={12} sm={6}>
                            <TextField  
                              label="First name" 
                              variant="outlined" 
                              fullWidth 
                              value={firstName} 
                              onChange={e => setFirstName(e.target.value)}
                              error = {txtFirstNameError}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField  
                              label="Last name" 
                              variant="outlined" 
                              fullWidth 
                              value={lastName} 
                              onChange={e => setLastName(e.target.value)}
                              error = {txtLastNameError}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField  
                              label="Address" 
                              variant="outlined" 
                              fullWidth 
                              
                              value={address} 
                              onChange={e => setAddress(e.target.value)}
                              error = {txtAddressError}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField  
                              label="Phone" 
                              variant="outlined" 
                              fullWidth 
                              value={phoneNo} 
                              onChange={e => setPhoneNo(e.target.value)}
                              error = {txtPhoneNoError}
                            />
                        </Grid>
                    </Grid>
                  </Container>
                </Grid>

                <Grid xs={12} lg={6} className="mt-5 xl:mt-0" >
                  <Container component="main" maxWidth="sm" sx={{px:3}} >
                    <div className='flex justify-between items-center mb-2 text-gray-700 text-[14px]'>
                      <p>Sub Total</p>
                      <p>LKR {getTotal().toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between items-center mb-2 text-gray-700 text-[14px]'>
                      <p>Shipping</p>
                      <p>LKR {SHIPPING_FEE.toFixed(2)}</p>
                    </div>
                    <hr />
                    <div className='flex justify-between items-center mb-5 mt-3 text-[18px]'>
                      <p className='font-medium'>Total</p>
                      <p className='font-medium'>LKR {total}</p>
                    </div>   
                    <div className='flex justify-end items-center'>
                      <Button 
                        variant="contained" 
                        size={window.innerWidth > 350 ? 'medium' : 'medium'}
                        sx={btnStyle1}  
                        fullWidth  
                        onClick={btnPlaceOrderOnClick}       
                      >
                          Place Order
                      </Button>
                    </div>   
                  </Container>
                </Grid>
              </Grid>
              
              <Footer/>

              <MyBackdrop backDropOpen={backDropOpen} />
            </>
          )
        }
    </div>
  )
}

const btnStyle1 ={
  backgroundColor:'black',
  mb:1,
  ":hover":{
    backgroundColor:"black"
  }
}

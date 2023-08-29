import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Link, useParams } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { ExpandCircleDownOutlined } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import AdminOrderDetailRow from '../Components/AdminOrderDetailRow'
import MyBackdrop from '../Components/MyBackdrop'
import isDesktop from '../CheckDevice'
import AdminPanelMobileWarning from '../Components/AdminPanelMobileWarning'

export default function AdminOrderDetails() {

  const {orderID} = useParams();
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {jwt} = useSelector(state => state.userInfo);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [order, setOrder] = useState({});
  const [productNameList, setProductNameList] = useState([]);

  const loadOrder = () => {
    setBackDropOpen(true)

    fetch(`${backendAddress}/order/${orderID}`,{
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
    })
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setOrder(data);     
    })
  }

  const loadProductList = async () => {
    if(order.orderDetails === undefined)return;
    
    setProductNameList([]);
    setBackDropOpen(true)

    const productIdArray = order.orderDetails.map(cartItem => cartItem.productID);

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
    const productNamesArray = order.orderDetails.map(orderDetail => {
      const productDetail = productDetails.find(productDetail => productDetail.productID == orderDetail.productID)
      return productDetail ? productDetail.name : "Deleted";
    });

    setBackDropOpen(false)
    setProductNameList(productNamesArray);
  }

  useEffect(() => {
    loadOrder();
  },[])

  useEffect(() => {
    loadProductList();
  },[order])

  return (
    <>
      {!isDesktop ? <AdminPanelMobileWarning /> : (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3] '><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='h-[13%] flex items-center mr-5'>
              <Link to={'..'}>
                <IconButton sx={{ml:2}}>
                  <ExpandCircleDownOutlined fontSize='large' className='text-white rotate-90'/> 
                </IconButton>
              </Link>
            </div>
            <div className='text-white bg-[#1E1E1E] mx-2 h-[87%] flex flex-col overflow-y-scroll hide-scrollbar rounded-t'>
              <div className='flex mx-5 mt-5 text-[17px] font-semibold'>
                <div className='flex-[4]'>Receiver's Details</div>
                <div className='flex-[4]'>Order Time</div>
                <div className='flex-[1] flex justify-center'>Order ID</div>
              </div>
              <div className='flex mx-5 mt-3 text-[14px]'>
                <div className='flex-[4]'>
                  <p>{order.receiverName}</p>
                  {order.receiverAddress?.split(",").map((line, index, array) => (
                    <p key={index}>{line}{index === array.length - 1 ? null : ','}</p>
                  ))}
                  <p>{order.receiverMobileNo}</p>
                </div>
                <div className='flex-[4]'>{order.date}</div>
                <div className='flex-[1] flex justify-center'>{orderID}</div>
              </div>
    
              <div className='flex flex-row mt-3 text-white mx-5 h-[10%] font-semibold text-[17px]'>
                <div className='flex-[2] flex items-center justify-center '>Product ID</div>
                <div className='flex-[3] flex items-center '>Name</div>
                <div className='flex-[2] flex items-center justify-center'>Size</div>
                <div className='flex-[2] flex items-center justify-center'>Quantity</div>
                <div className='flex-[2] flex items-center justify-center'>Unit Price</div>
                <div className='flex-[2] flex items-center justify-end'>
                  <p className='mr-3'>Amount</p>
                </div> 
              </div>
              <hr className=' mb-4' />
              <div className='max-h-[86%] overflow-y-scroll hide-scrollbar'>
                {order.orderDetails?.map((orderDetail, index) => (
                  <AdminOrderDetailRow key={orderDetail.id} orderDetail={orderDetail} productName={productNameList[index]}/>
                  ))}
              </div>
              
              
              <div className='flex justify-end mt-4 text-white mx-5 text-[16px] mb-5'>
                  <div className='w-[23%] mr-3 space-y-2'>
                    <div className='flex justify-between'>
                      <p>Sub Total</p>
                      <p>{(order.total - order.shippingFee).toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p>Shipping</p>
                      <p>{order.shippingFee?.toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between font-medium'>
                      <p>Total</p>
                      <p>{order.total?.toFixed(2)}</p>
                    </div>
                  </div>
              </div>
              
            </div>
          </div>
          <MyBackdrop backDropOpen={backDropOpen} />
        </div>
      )}
    </>      
  )
}

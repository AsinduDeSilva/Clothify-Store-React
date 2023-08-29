import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { useSelector } from 'react-redux';
import Footer from '../Components/Footer';
import { Pagination } from '@mui/material';
import MyBackdrop from '../Components/MyBackdrop';


export default function Orders() {

  const [orderList, setOrderList] = useState([]);
  const [productDetailsList, setProductDetailsList] = useState([]);
  const {customerID, jwt} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0); 
  
  
  const loadOrderList = (page) => {
    setBackDropOpen(true)
    fetch(`${backendAddress}/order/customer/${customerID}?page=${page}`,{  
      headers: {
        'Authorization': `Bearer ${jwt}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      setBackDropOpen(false); 
      setOrderList(data.content)
      setPageCount(data.totalPages);      
    })
  }   

  
  const loadProducts = async () => {
    let productIdArray =[];

    orderList.forEach(order => {
      order.orderDetails.forEach(orderDetail => productIdArray.push(orderDetail.productID))
    }) 

    if (productIdArray.length === 0){
      setProductDetailsList([]);
      return;
    }

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

    const orderProductList = orderList.map(
      order => order.orderDetails.map(orderDetail => productDetails.find(product => product.productID == orderDetail.productID))
    );

    setBackDropOpen(false)
    setProductDetailsList(orderProductList)

  } 
  
  useEffect(() => {
    loadOrderList(1)
  },[])

  useEffect(() => {
    loadProducts();
  }, [orderList]);

  const handleChange = (event, value) => {
    loadOrderList(value)
  };


  
  return (
        <div>
          <Navbar/>
          <Heading name='My Orders' /> 

          <div className="bg-white">
          <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:pb-24 lg:px-8">
            <div>
              <h2 className="sr-only">Recent orders</h2>
              {orderList.length === 0 ? (
                <div className='h-[70px] mt-12 flex items-center justify-center'>
                  Empty
                </div>
              ) : (
              <div className="space-y-20">                
                  {orderList.map((order, orderIndex) => (                   
                    <div key={order.orderID}>   
                      <div className="bg-gray-50 rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8">
                        <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                          <div className="flex justify-between sm:block">
                            <dt className="font-medium text-gray-900">Date placed</dt>
                            <dd className="sm:mt-1">
                              <time dateTime={order.date}>{order.date}</time>
                            </dd>
                          </div>
                          <div className="flex justify-between pt-6 sm:block sm:pt-0">
                            <dt className="font-medium text-gray-900">Order ID</dt>
                            <dd className="sm:mt-1">{order.orderID}</dd>
                          </div>
                          <div className="flex justify-between pt-6 sm:block sm:pt-0">
                            <dt className="font-medium text-gray-900">Order Status</dt>
                            <dd className="sm:mt-1">{order.status}</dd>
                          </div>
                        </dl>
                        
                      </div>
      
                      <table className="mt-4 w-full text-gray-500 sm:mt-6">
                        <caption className="sr-only">Products</caption>
                        <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                          <tr>
                            <th scope="col" className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal">
                              Product
                            </th>
                            <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal text-center sm:table-cell">
                              Price (LKR)
                            </th>
                            <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal text-center sm:table-cell">
                              Qty
                            </th>
                            
                            <th scope="col" className="w-1/5 py-3 font-normal text-right">
                              Total (LKR)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t">
                          {order.orderDetails.map((orderDetail, orderDetailIndex) => (
                            <tr key={orderDetail.id}>
                              <td className="py-6 pr-8">
                                <div className="flex items-center">
                                  <img
                                    src={productDetailsList[orderIndex]?.[orderDetailIndex]?.imgFileName === undefined ? null :
                                      `${backendAddress}/product/image/${productDetailsList[orderIndex]?.[orderDetailIndex]?.imgFileName}`}
                                    alt={'product ' + orderDetail.productID}
                                    className="w-16 h-16 object-center object-cover rounded mr-6"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">{productDetailsList[orderIndex]?.[orderDetailIndex]?.name}</div>
                                    <div className="mt-1">{orderDetail.size}</div>
                                    <div className="mt-1 sm:hidden">{orderDetail.unitPrice.toFixed(2)}</div>
                                    <div className="mt-1 sm:hidden">Qty : {orderDetail.quantity}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden py-6 pr-8 sm:table-cell text-center">{orderDetail.unitPrice.toFixed(2)}</td>
                              <td className="hidden py-6 pr-8 sm:table-cell text-center">{orderDetail.quantity}</td>
                              <td className="py-6 font-medium text-right whitespace-nowrap">
                                {(orderDetail.unitPrice * orderDetail.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div> 

          <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 pb-10 flex justify-center'>
            <Pagination count={pageCount} onChange={handleChange} size={window.innerWidth > 350 ? 'medium' : 'small' } /> 
          </div>

          <Footer />

          <MyBackdrop backDropOpen={backDropOpen} />
        </div>
  )
}


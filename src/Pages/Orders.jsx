import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Heading from '../Components/Heading'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Footer from '../Components/Footer';
import { Backdrop, CircularProgress, Pagination } from '@mui/material';


export default function Orders() {

  const [orderList, setOrderList] = useState([]);
  const [productDetailsList, setProductDetailsList] = useState([]);
  const {customerID, isLogged} = useSelector(state => state.userInfo);
  const {backendAddress} = useSelector(state => state.backendInfo);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0); 
  
  
  const loadOrderList = (page) => {
    setBackDropOpen(true)
    fetch(`http://${backendAddress}/order/customer/${customerID}?page=${page}`,{  
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
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
    setBackDropOpen(true)
    let orderProductList = [];
    
    for (const order of orderList) {
      const fetchPromises = order.orderDetails.map(async (orderDetail) => {
        const response = await fetch(`http://${backendAddress}/product/${orderDetail.productID}`);
        const data = await response.json();
        return data;
      });
    
      const productDetailsArray = await Promise.all(fetchPromises);
      setBackDropOpen(false)
      orderProductList.push(productDetailsArray);
    }
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
  
            <div className="space-y-20">
                {orderList.map((order, orderIndex) => (
                  <div key={order.orderID}>   
                    <div className="bg-gray-50 rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8">
                      <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-900">Date placed</dt>
                          <dd className="sm:mt-1">
                            <time dateTime={order.dateAndTime}>{order.dateAndTime.substring(0,10)}</time>
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
                                    `http://${backendAddress}/product/image/${productDetailsList[orderIndex]?.[orderDetailIndex]?.imgFileName}`}
                                  alt={'product'}
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
            </div>
          </div>
        </div> 

        <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 pb-10 flex justify-center'>
          <Pagination count={pageCount} onChange={handleChange} size={window.innerWidth > 350 ? 'medium' : 'small' } /> 
        </div>

        <Footer />

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}   
        >
          <CircularProgress color="inherit" />
        </Backdrop>

    </div>
  )
}


import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Pagination, Tab, Tabs } from '@mui/material'
import AdminProductRow from '../Components/AdminProductRow';
import { useSelector } from 'react-redux';
import MyBackdrop from '../Components/MyBackdrop';


export default function AdminProducts() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  const [backDropOpen, setBackDropOpen] = useState(false);

  const loadProducts = (page) => {
    setBackDropOpen(true)

    fetch(`http://${backendAddress}/product/category/${activeCategory}?page=${page}`)
     .then(res => res.json())
     .then(data => {
        setBackDropOpen(false);
        setProductList(data.content);
        setPageCount(data.totalPages);
    })
  }

  useEffect(() => {
    loadProducts(1);
  },[])

  useEffect(() => {
    loadProducts(1);
  },[activeCategory])

  const onTabChange = (e, newTab) => {
    let category;
    switch (newTab) {
      case 0 : category = "all"; break;
      case 1 : category = "men"; break;
      case 2 : category = "women"; break;
      case 3 : category = "kids"; break;
      case 4 : category = "accessories";
    }
    setActiveCategory(category);
    setActiveTab(newTab);
  }

  return (
    <div className='flex-row flex h-[100vh] '>
        <div className='flex-[3] '><AdminSidePanel/></div>
        <div className='flex-[11] bg-[#141414] -ml-1'>
            <div className='h-[13%] '>
                {/* Add Button */}
            </div>
            <div className='text-white bg-[#1E1E1E] mx-2 py-2 h-[9%]'>
              <Tabs 
                value={activeTab} 
                centered 
                onChange={onTabChange}  
                textColor='inherit' 
                
                TabIndicatorProps={{
                    style: {
                      backgroundColor: "#00C2BE"
                    }
                }}
              >
                <Tab label="All" />
                <Tab label="Men" />
                <Tab label="Women" />
                <Tab label="Kids" />
                <Tab label="Accessories"  />              
              </Tabs>
            </div>
            <div className='h-[76.8%] mx-2 mt-2 bg-[#1E1E1E]'>
              <div className='flex flex-row text-white mx-5 h-[10%] font-semibold text-lg'>
                 <div className='flex-[2] flex items-center justify-center '>Product ID</div>
                 <div className='flex-[2] flex items-center justify-center '>Image</div>
                 <div className='flex-[4] flex items-center  '>Name</div>
                 <div className='flex-[2] flex items-center justify-center'>Unit Price</div>
                 <div className='flex-[2] flex items-center justify-center '>Quantity</div>
                 <div className='flex-[2] flex items-center justify-center '>Actions</div>   
              </div>    
              <hr className='mb-4' />

              <div className='h-[86%] overflow-y-scroll product-table'>
                {productList.map(productDetails => (
                    <AdminProductRow key={productDetails.productID} productDetails={productDetails}/>
                ))}
                <div className='w-full flex justify-center py-3'>
                  <Pagination count={pageCount} onChange={(e, value) => loadProducts(value)}   /> 
                </div>
              </div>

            </div>

        </div>
        <MyBackdrop backDropOpen={backDropOpen}/>
    </div>
  )
}

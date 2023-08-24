import React, { useEffect, useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { Button, Pagination, Tab, Tabs } from '@mui/material'
import AdminProductRow from '../Components/AdminProductRow';
import { useSelector } from 'react-redux';
import MyBackdrop from '../Components/MyBackdrop';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';


export default function AdminProducts() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0); 
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const isDesktop = !/Mobi|Android|Tablet|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
      //case 4 : category = "accessories";
    }
    setActiveCategory(category);
    setActiveTab(newTab);
  }

  return (
    <>
      {isDesktop ? (
        <div className='flex-row flex h-[100vh] '>
          <div className='flex-[3] '><AdminSidePanel/></div>
          <div className='flex-[11] bg-[#141414] -ml-1'>
              <div className='h-[13%] flex justify-end items-center mr-5'>
                  <Link to='add'>
                    <Button 
                      variant='contained' 
                      startIcon={<Add/>} 
                      sx={{py: 1.5, px: 4, background: '#026472', ":hover":{background: '#026C7B'}}} 
                      className='hover:bg-red-400' 
                    >
                      Add Product
                    </Button>
                  </Link>
              </div>
              <div className='text-white bg-[#1E1E1E] mx-2 py-2 h-[9%] rounded'>
                <Tabs 
                  value={activeTab} 
                  centered 
                  onChange={onTabChange}  
                  textColor='inherit' 
                  TabIndicatorProps={{
                      style: {
                        backgroundColor: "#fff"
                      }
                  }}
                >
                  <Tab label="All" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Men" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Women" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  <Tab label="Kids" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/>
                  {/* <Tab label="Accessories" className='hover:bg-[#141414]' sx={{borderRadius:"5px"}}/> */}
                </Tabs>
              </div>
              <div className='h-[76.8%] mx-2 mt-2 bg-[#1E1E1E] rounded-t'>
                <div className='flex flex-row text-white mx-5 h-[10%] font-semibold text-[17px]'>
                  <div className='flex-[2] flex items-center justify-center '>Product ID</div>
                  <div className='flex-[2] flex items-center justify-center '>Image</div>
                  <div className='flex-[4] flex items-center  '>Name</div>
                  <div className='flex-[2] flex items-center justify-center'>Unit Price</div>
                  <div className='flex-[2] flex items-center justify-center '>Quantity</div>
                  <div className='flex-[2] flex items-center justify-center '>Actions</div>   
                </div>    
                <hr className='mb-4' />

                <div className='h-[86%] overflow-y-scroll hide-scrollbar'>
                  {productList.map((productDetails, index) => (
                      <AdminProductRow 
                        key={productDetails.productID} 
                        productDetails={productDetails} 
                        setProductList={setProductList}
                        index={index}
                      />
                  ))}
                  <div className='w-full flex justify-center py-3'>
                    <Pagination 
                      count={pageCount} 
                      onChange={(e, value) => loadProducts(value)} 
                      sx={{"& .MuiPaginationItem-root": {
                        color: "#fff",
                      }, "& .Mui-selected" : {
                        backgroundColor: "#141414"
                      }}}  
                    /> 
                  </div>
                </div>

              </div>

          </div>
          <MyBackdrop backDropOpen={backDropOpen}/>
      </div>
      ) : null}
    </>
  )
}

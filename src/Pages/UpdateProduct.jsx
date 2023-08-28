import React, { useState } from 'react'
import AdminSidePanel from '../Components/AdminSidePanel'
import { ExpandCircleDownOutlined } from '@mui/icons-material'
import { Button, FormControl, IconButton, InputBase, MenuItem, Select, TextField} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
import MyBackdrop from '../Components/MyBackdrop'
import isDesktop from '../CheckDevice'
import AdminPanelMobileWarning from '../Components/AdminPanelMobileWarning'
import styled from 'styled-components'
import AdminTextField from '../Components/AdminTextField'


export default function UpdateProduct() {
  
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {jwt} = useSelector(state => state.userInfo);
  const productDetails = useLocation().state?.productDetails; 
  const [productName, setProductName] = useState(productDetails.name); 
  const [unitPrice, setUnitPrice] = useState(productDetails.unitPrice.toFixed(2));
  const [category, setCategory] = useState(productDetails.category); 
  const [qtySmall, setQtySmall] = useState(productDetails.smallQty);
  const [qtyMedium, setQtyMedium] = useState(productDetails.mediumQty);
  const [qtyLarge, setQtyLarge] = useState(productDetails.largeQty);
  const [image, setImage] = useState(null)
  
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [txtProductNameError, setTxtProductNameError] = useState(false); 
  const [txtUnitPriceError, setTxtUnitPriceError] = useState(false);
  const [categoryError, setCategoryError] = useState(false); 
  const [txtQtySmallError, setTxtQtySmallError] = useState(false);
  const [txtQtyMediumError, setTxtQtyMediumError] = useState(false);
  const [txtQtyLargeError, setTxtQtyLargeError] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    maxFiles: 1, 
    accept: {
        'image/png': [],
        'image/jpeg': []
    },
    onDrop: acceptedFiles => {
        setImageError(false);
        setImage(acceptedFiles[0]);
    },

  });
  
  const updateProductDetails = () => {
      
    if(!checkValidity())return;
      
    let formData = new FormData();
    formData.append("name", productName);
    formData.append("unitPrice", unitPrice);
    formData.append("category", category);
    formData.append("smallQty", qtySmall);
    formData.append("mediumQty", qtyMedium);
    formData.append("largeQty", qtyLarge);

    setBackDropOpen(true)

    fetch(`${backendAddress}/product/${productDetails.productID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
        body: formData
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false)
        if(data.success){
            Swal.fire({
              title: 'Success!',
              text: 'Product has been updated.',
              icon: 'success',
              confirmButtonColor: '#484848',
              customClass:{
                popup: 'bg-[#1E1E1E] text-white'
              }
            })
        }
      })
  }

  const updateProductImage = () => {
    setImageError(false);
      
    if(image === null){
      setImageError(true);  
      return;
    }
      
    let formData = new FormData();
    formData.append("image", image);

    setBackDropOpen(true)

    fetch(`${backendAddress}/product/image/${productDetails.productID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
        body: formData
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false)
        if(data.success){
            Swal.fire({
              title: 'Success!',
              text: 'Product has been updated.',
              icon: 'success',
              confirmButtonColor: '#484848',
              customClass:{
                popup: 'bg-[#1E1E1E] text-white'
              }
            })
        }
      })
  }

  const checkValidity = () => {

    setTxtProductNameError(false);
    setTxtUnitPriceError(false);
    setCategoryError(false);
    setTxtQtySmallError(false);
    setTxtQtyMediumError(false);
    setTxtQtyLargeError(false);

    let isValid = true;
    if(productName === ""){
      setTxtProductNameError(true);
      isValid = false;
    }

    if(unitPrice === "" || unitPrice <= 0 ){
      setTxtUnitPriceError(true);
      isValid = false;
    }

    if(category === ""){
      setCategoryError(true);
      isValid = false;
    }

    if(qtySmall === "" || qtySmall < 0){
      setTxtQtySmallError(true);
      isValid = false;
    }

    if(qtyMedium === "" || qtyMedium < 0){
      setTxtQtyMediumError(true);
      isValid = false;
    }

    if(qtyLarge === "" || qtyLarge < 0){
      setTxtQtyLargeError(true);
      isValid = false;
    }

    return isValid;
  }


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
              <div className='text-white bg-[#1E1E1E] mx-2 h-[87%] flex flex-col overflow-y-scroll hide-scrollbar'>
                  <div className='mx-16 flex items-center mt-7 '>
                      <span className='flex-1 font-medium'>Product Name </span>
                      <div className='flex-[2]'>
                          <AdminTextField 
                            variant="outlined" 
                            size='small'
                            value={productName}
                            error={txtProductNameError} 
                            onChange={e => setProductName(e.target.value)}
                            sx={{borderRadius: 1, width:'80%'}}
                          />
                      </div>
                  </div>
                  <div className='mx-16 flex items-center mt-7 '>
                      <span className='flex-1 font-medium'>Unit Price (LKR)</span>
                      <div className='flex-[2]'>
                          <AdminTextField 
                            type='number'
                            inputProps={{min: 0}}
                            variant="outlined" 
                            size='small'
                            value={unitPrice}
                            error={txtUnitPriceError}
                            onChange={e => setUnitPrice(e.target.value)}
                            sx={{borderRadius: 1, width: 150}}
                          />
                      </div>
                  </div>
                  <div className='mx-16 flex items-center mt-7 '>
                      <span className='flex-1 font-medium'>Category</span>
                      <div className='flex-[2]'>
                          <FormControl >
                              <Select    
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  error={categoryError}    
                                  value={category}
                                  size='small'
                                  displayEmpty
                                  onChange={e => setCategory(e.target.value)}
                                  sx={{width: 150, borderRadius: 1}}
                                  input={<BootstrapInput/>}
                              >
                                <MenuItem value="">Select</MenuItem>    
                                <MenuItem value={"MEN"}>Men</MenuItem>
                                <MenuItem value={"WOMEN"}>Women</MenuItem>
                                <MenuItem value={"KIDS"}>Kids</MenuItem>
                              </Select>
                          </FormControl>  
                      </div>
                  </div>
                  <div className='mx-16 flex items-center mt-7 '>
                      <span className='flex-1 font-medium'>Quantity</span>
                      <div className='flex-[2] flex justify-between'>
                          <div className='flex items-center'>
                              <span className='mr-5'>Small</span> 
                              <AdminTextField 
                                type='number'
                                inputProps={{min: 0}}
                                variant="outlined" 
                                size='small'
                                value={qtySmall}
                                error={txtQtySmallError}
                                onChange={e => setQtySmall(e.target.value)}
                                sx={{borderRadius: 1, width: 100, scale: '0.9'}}
                              />
                          </div>
                          <div className='flex items-center'>
                              <span className='mr-5'>Medium</span>
                              <AdminTextField 
                                type='number'
                                inputProps={{min: 0}}
                                variant="outlined" 
                                size='small'
                                value={qtyMedium}
                                error={txtQtyMediumError}
                                onChange={e => setQtyMedium(e.target.value)}
                                sx={{borderRadius: 1, width: 100, scale: '0.9'}}
                              />
                          </div>
                          <div className='flex items-center'>
                              <span className='mr-5'>Large</span>
                              <AdminTextField 
                                type='number'
                                inputProps={{min: 0}}
                                variant="outlined" 
                                size='small'
                                value={qtyLarge}
                                error={txtQtyLargeError}
                                onChange={e => setQtyLarge(e.target.value)}
                                sx={{borderRadius: 1, width: 100, scale: '0.9'}}
                              />
                          </div>
                      </div>
                  </div>
                  <div className='mx-16 flex justify-end my-7 '>
                      <Button 
                        variant='contained' 
                        sx={{py: 1.5, px: 4, background: '#026472', ":hover":{background: '#026C7B'}}} 
                        onClick={updateProductDetails} 
                      >
                        Update Details
                      </Button>
                  </div>
                      <hr className='mx-16' />
                  <div className='mx-16 flex  mt-7 '>
                      <span className='flex-1 font-medium'>Image</span>
                      <div className='flex-[2]'>
                          <div {...getRootProps({className: 'dropzone'})}>
                              <input {...getInputProps()}/>
                              <p className='text-white h-[110px] border border-[#E0E3E7] hover:border-[#B2BAC2] cursor-pointer font-semibold flex items-center justify-center rounded'>
                                  Drag your Image here or click to select Image
                              </p>
                              {image === null || acceptedFiles.length === 0 ? null : (
                                  <>
                                    <p className='text-sm my-2'>
                                      Selected File : {acceptedFiles?.[0].name}
                                    </p>
                                    <img src={URL.createObjectURL(acceptedFiles[0])} alt="product" className='h-[100px]'/>
                                  </>
                              )}
                              {!imageError ? null : (
                                  <p className='text-[#C62828] text-sm mt-2'>
                                      Please Select an Image
                                  </p>
                              )}        
                          </div>
                      </div>
                  </div>
                  <div className='mx-16 flex justify-end my-7 '>
                      <Button 
                        variant='contained' 
                        sx={{py: 1.5, px: 4, background: '#026472', ":hover":{background: '#026C7B'}, width: 188}} 
                        onClick={updateProductImage} 
                      >
                        Update Image
                      </Button>
                  </div>
              </div>
          </div>
          <MyBackdrop backDropOpen={backDropOpen}/>
      </div> 
      )}
    </>       
  )
}

const BootstrapInput = styled(InputBase)(() => ({
  '& .MuiSelect-icon': {
    color: 'white'
  },
  '& .MuiInputBase-input': {
    color: 'white',
    borderRadius: 4,
    position: 'relative',   
    border: '1px solid #E0E3E7',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    '&:hover': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused': {
      borderColor: '#6F7E8C',
    }
  },
}));

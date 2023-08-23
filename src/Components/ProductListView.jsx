import React from 'react'
import ProductView from './ProductView'
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function ProductListView({products}) {

  const navigate = useNavigate();
  const {isAdmin} = useSelector(state => state.userInfo);

  const productClicked = (productID) => {
    if(!isAdmin){
      navigate(`/products/${productID}`);
    }
  }

  return (
      <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-14 pb-14'>
        <Grid container spacing={{xs:1, sm:4, xl:6}}>
          {
            products.map((product) => (
              <Grid xs={6} md={4} lg={3} key={product.productID} >
                <div onClick={e => productClicked(product.productID)}>
                  <ProductView
                    key={product.productID}  
                    image = {product.imgFileName}
                    name = {product.name}
                    price = {product.unitPrice}
                  />
                </div>
              </Grid>
          ))}
        </Grid>

      </div>
  )
}

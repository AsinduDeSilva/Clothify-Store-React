import React from 'react'
import ProductView from './ProductView/ProductView'
import Grid from '@mui/material/Unstable_Grid2';


export default function ProductListView(props) {
  return (
      <div className='px-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 pb-14'>
        <Grid container spacing={{xs:1, sm:4, xl:6}}>
          {
            props.products.map((product) => (
              <Grid xs={6} md={4} xl={3}>
                <ProductView 
                  image = {product.imgFileName}
                  name = {product.name}
                  price = {product.unitPrice}
                />
              </Grid>
          ))}
        </Grid>

        <Grid container spacing={{xs:1, sm:4, xl:6}}>
          {
            props.products.map((product) => (
              <Grid xs={6} md={4} xl={3}>
                <ProductView 
                  image = {product.imgFileName}
                  name = {product.name}
                  price = {product.unitPrice}
                />
              </Grid>
          ))}
        </Grid>
      </div>
  )
}

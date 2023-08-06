import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
  isLogged: Cookies.get('jwt') !== undefined ,
  customerID: "",
  cart: [],
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setLogged: (state, action) => {
        state.isLogged = action.payload;
    },
    setCustomerID: (state,action) => {
        state.customerID =action.payload;
    },
    addToCart: (state,action) => {
        const payload = action.payload;

        const existingCartItemIndex = state.cart.findIndex(
            cartItem => cartItem.productID === payload.productID && cartItem.size === payload.size
        );
      
        if (existingCartItemIndex !== -1) {
          state.cart[existingCartItemIndex].qty = payload.qty;
          return;
        }
        
        state.cart.push(payload);
        
    },
  },
})

export const {setLogged, addToCart, setCustomerID } = userInfoSlice.actions

export default userInfoSlice.reducer
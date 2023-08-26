import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
  customerID: Cookies.get('customerID'),
  isAdmin: Cookies.get('isAdmin') === undefined ? false : Cookies.get('isAdmin') === "true",
  isCustomer: Cookies.get('isCustomer') === undefined ? false : Cookies.get('isCustomer') === "true",
  cart: Cookies.get('cart') === undefined ? [] : JSON.parse(Cookies.get('cart')),
  jwt: Cookies.get('jwt')
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    login: (state, action) => {
      const {isCustomer, jwt, remember} = action.payload;
      state.isCustomer = isCustomer;
      state.isAdmin = !isCustomer;
      state.jwt = jwt;

      if(remember){
        Cookies.set('jwt', jwt, { expires: 7 });
        Cookies.set("isAdmin", state.isAdmin, {expires: 7});
        Cookies.set("isCustomer", state.isCustomer, {expires: 7});
      }
    },
    logout: (state) => {
      state.isAdmin = false;
      state.isCustomer = false;
      state.jwt = null;
      state.customerID = null;
      Cookies.remove('isAdmin');
      Cookies.remove('isCustomer');
      Cookies.remove('jwt');
      Cookies.remove('customerID')
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
        Cookies.set('cart', JSON.stringify(state.cart))
        
    },
    updateCart: (state, action) => {
      state.cart = action.payload;
      Cookies.set('cart', JSON.stringify(state.cart))
    },
  },
})

export const {addToCart, setCustomerID, updateCart, login, logout} = userInfoSlice.actions

export default userInfoSlice.reducer
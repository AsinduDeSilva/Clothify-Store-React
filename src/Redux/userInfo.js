import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const loadServerCart = async () => {
  const response = await fetch(`http://192.168.1.20:8080/customer/${Cookies.get('customerID')}`, {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${Cookies.get('jwt')}`,
    }
  })
  const data = await response.json();
  return data.cart;
}

const initialState =  {
  customerID: Cookies.get('customerID'),
  isAdmin: Cookies.get('isAdmin') === undefined ? false : Cookies.get('isAdmin') === "true",
  isCustomer: Cookies.get('isCustomer') === undefined ? false : Cookies.get('isCustomer') === "true",
  cart: Cookies.get('isCustomer') === "true" ? await loadServerCart() : Cookies.get('cart') === undefined ? [] : JSON.parse(Cookies.get('cart')),
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
      state.cart = [];
      Cookies.remove('isAdmin');
      Cookies.remove('isCustomer');
      Cookies.remove('jwt');
      Cookies.remove('customerID');
      Cookies.remove('cart');
    },
    setCustomerID: (state,action) => {
        state.customerID =action.payload;
    },
    addToCart: (state,action) => {
      const updatedCart = [...state.cart, action.payload]; 
      state.cart = updatedCart;  
      if(!state.isCustomer){
        Cookies.set('cart', JSON.stringify(state.cart));
      }
    },
    removeFromCart: (state, action) => {
      const indexesToRemove = action.payload;

      for (let i = indexesToRemove.length - 1; i >= 0; i--) {
        state.cart.splice(indexesToRemove[i], 1);
      }

      Cookies.set('cart', JSON.stringify(state.cart));
    },
    updateCart: (state, action) => {
      const {index, data} = action.payload;
      state.cart[index] = data;
      if(!state.isCustomer){
        Cookies.set('cart', JSON.stringify(state.cart));
      }
    },
    emptyCart: (state) => {
      state.cart = [];
      if(!state.isCustomer){
        Cookies.remove('cart');
      }
    },
    setCart: (state, action) => {
      state.cart = action.payload;
      Cookies.remove('cart');
    }
  },
})

export const {addToCart, setCustomerID, removeFromCart, updateCart, emptyCart, setCart, login, logout} = userInfoSlice.actions;

export default userInfoSlice.reducer;


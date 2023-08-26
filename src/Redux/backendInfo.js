import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  backendAddress: "http://192.168.1.20:8080"
}

export const backendInfoSlice = createSlice({
  name: 'backend',
  initialState, 
})


export default backendInfoSlice.reducer
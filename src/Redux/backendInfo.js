import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  backendAddress: "https://clothifystore-backend-production.up.railway.app"
}

export const backendInfoSlice = createSlice({
  name: 'backend',
  initialState, 
})


export default backendInfoSlice.reducer
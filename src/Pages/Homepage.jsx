import React from 'react'
import Navbar from '../Components/Navbar'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'

export default function Homepage() {

  const {cart, customerID} =useSelector((state) => state.userInfo)
  console.log(customerID)

  return (
    <div>
      <Navbar/>
    </div>
  )
}

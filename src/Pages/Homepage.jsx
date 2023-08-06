import React from 'react'
import Navbar from '../Components/Navbar'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'

export default function Homepage() {

  const {cart} =useSelector((state) => state.userInfo)
  console.log(cart[1])

  return (
    <div>
      <Navbar/>
      {Cookies.get('jwt')}
    </div>
  )
}

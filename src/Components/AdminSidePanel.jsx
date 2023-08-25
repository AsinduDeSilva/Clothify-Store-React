import React from 'react'
import logo from '../assets/logo.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard, ExitToApp, Inventory2, Person2Outlined, Settings, ShoppingCart } from '@mui/icons-material';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { logout, setCustomerID } from '../Redux/userInfo';
import { useDispatch } from 'react-redux';

const navigation = [
  { name: 'Dashboard', icon: Dashboard,  to: '/admin/dashboard'},
  { name: 'Products', icon: Inventory2,  to: '/admin/products' },
  { name: 'Orders', icon: ShoppingCart,  to: '/admin/orders'},
  { name: 'Settings', icon: Settings,  to: '/admin/settings'},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminSidePanel() {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const btnLogoutOnClick = () => {
    Swal.fire({
      title: 'Are you sure?',   
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#484848',
      confirmButtonText: 'Logout',
      confirmButtonColor: '#026472',
      customClass:{
        popup: 'bg-[#1E1E1E] text-white'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('jwt');
        Cookies.remove('customerID')
        dispatch(logout())
        dispatch(setCustomerID(undefined))
        navigate("/", {replace: true})  
      }
    })   
  }

  return (
    <div className="flex flex-col flex-grow border-r pb-4  overflow-y-auto bg-[#1E1E1E] h-[100vh] w-full">
      <div className="flex items-center justify-center flex-shrink-0 px-4 bg-black py-3 h-[13%]">
        <img
          className="h-[75px] w-auto"
          src={logo}
          alt="Workflow"
        />
      </div>
      <div className="mt-14 flex-grow flex flex-col bg-[#1E1E1E]">
        <nav className="flex-1 px-12 space-y-3" aria-label="Sidebar">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return(
              <Link
                key={item.name}
                to={item.to}
                className={classNames(
                    isActive ? 'bg-[#141414] text-white' : 'text-gray-400  hover:bg-[#141414]',
                    'group flex items-center px-2 py-3 text-sm font-medium rounded-md '
                )}
              >   
                  <item.icon
                    className={classNames(
                      isActive ? 'text-white' : 'text-gray-400 hover:text-inherit','mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}

              </Link>
            )
          })}
          <hr className='border-gray-400' />

          <Link
            className='text-gray-400 group flex items-center px-2 py-3 text-sm font-medium hover:cursor-pointer'
            to="/"
          >   
              <Person2Outlined
                className='mr-3 flex-shrink-0 h-6 w-6'
                aria-hidden="true"
              />
                User Panel
          </Link>

          <div
            className='text-gray-400 group flex items-center px-2 py-3 text-sm font-medium hover:cursor-pointer'
            onClick={btnLogoutOnClick}
          >   
              <ExitToApp
                className='mr-3 flex-shrink-0 h-6 w-6'
                aria-hidden="true"
              />
                Logout
          </div>

        </nav>
      </div>
    </div>
  )
}

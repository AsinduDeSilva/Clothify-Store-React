import React from 'react'
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
import { Dashboard, ExitToApp, Inventory2, Settings, ShoppingCart } from '@mui/icons-material';

const navigation = [
  { name: 'Dashboard', icon: Dashboard,  to: '/admin', current: false },
  { name: 'Products', icon: Inventory2,  to: '/admin/products', current: true },
  { name: 'Orders', icon: ShoppingCart,  to: '/admin', current: false },
  { name: 'Settings', icon: Settings,  to: '/admin', current: false },
  { name: 'Logout', icon: ExitToApp,  to: '/admin', current: false },
 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminSidePanel() {
  return (
    <div className="flex flex-col flex-grow border-r pb-4  overflow-y-auto bg-[#1E1E1E] h-[100vh] w-full">
      <div className="flex items-center justify-center flex-shrink-0 px-4 bg-black py-3 h-[13%]">
        <img
          className="h-[75px] w-auto"
          src={logo}
          alt="Workflow"
        />
      </div>
      <div className="mt-20 flex-grow flex flex-col bg-[#1E1E1E]">
        <nav className="flex-1 px-12  space-y-4" aria-label="Sidebar">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={classNames(
                  item.current ? 'bg-[#141414] text-white' : 'text-gray-400  hover:bg-[#141414] hover:text-',
                  'group flex items-center px-2 py-3 text-sm font-medium rounded-md '
              )}
            >   
                <item.icon
                  className={classNames(
                    item.current ? 'text-white' : 'text-gray-400 hover:text-inherit','mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}

            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

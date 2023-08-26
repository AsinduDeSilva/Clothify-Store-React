import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo.jpg';
import { AccountCircleOutlined, ExitToApp, HistoryOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCustomerID } from '../Redux/userInfo';
import Swal from 'sweetalert2';
import { Badge } from '@material-tailwind/react';


const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Latest', to: '/products/latest'},
  { name: 'Men', to: '/products/men'},
  { name: 'Women', to: '/products/women'},
  { name: 'Kids', to: '/products/kids'},
  //{ name: 'Accessories', to: '/products/accessories'},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Navbar() {

  const {isAdmin, isCustomer, cart } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  function navigateToLogin(){
    navigate("/login")
  }

  const logoutBtnClicked = () => {
    Swal.fire({
      title: 'Are you sure?',   
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#026472',
    })
     .then((result) => {
      if (result.isConfirmed) {
        dispatch(logout())
        dispatch(setCustomerID(undefined))
        navigate("/", {replace: true})  
      }
    })
  }
  

  return (
    <div className="sticky top-0 z-50">
    <Disclosure as="nav" className="bg-black ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-8xl px-2 md:px-6 lg:px-8 ">
            <div className="relative flex h-20 items-center justify-between ">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start h-10">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-14 w-auto"
                    src={logo}
                    alt="logo"
                  />
                </div>
                <div className="hidden md:ml-6 lg:ml-16 md:block text-md">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.to;
                      return(
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-1 py-2 text-md font-medium'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 ">
                {isAdmin ? null : (
                  <Link to="/cart">
                    <Badge content={cart.length} withBorder className={`border-black bg-[#00928F] ${cart.length === 0 ? 'hidden' : null}`} >
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white  "
                      >
                        <span className="absolute -inset-1.5" />
                          <ShoppingCartOutlined className="h-6 w-6" aria-hidden="true"  />
                      </button>
                    </Badge> 
                  </Link> 
                )}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 hidden md:block p-1 ">
                  <div >
                    <Menu.Button onClick={isAdmin || isCustomer ? null : navigateToLogin} className="relative flex rounded-full bg-gray-800 text-gray-400 p-1 hover:text-white scale-[1.15]">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <AccountCircleOutlined aria-hidden="true" className="h-8 w-8 rounded-full" />
                      
                    </Menu.Button>
                  </div>
                  {isAdmin || isCustomer ? (
                      <>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                            { isCustomer ? (
                              <>
                                <Menu.Item>
                                  <Link
                                    to = '/orders'
                                    className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                                  >
                                      <HistoryOutlined className='mr-3 text-gray-700'/>
                                      My Orders
                                  </Link>              
                                </Menu.Item>  

                                <Menu.Item>
                                  <Link
                                    to = '/profile/overview'
                                    className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                                  >
                                      <AccountCircleOutlined className='mr-3 text-gray-700'/>
                                      Profile
                                  </Link>
                                </Menu.Item>
                              </>
                            ) : (
                              <Menu.Item>
                                  <Link
                                    to = '/admin/dashboard'
                                    className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                                  >
                                      <SupervisorAccountOutlined className='mr-3 text-gray-700'/>
                                      Admin Panel
                                  </Link>
                              </Menu.Item>
                            )}

                            <Menu.Item>
                                <Link
                                  onClick={logoutBtnClicked}   
                                  className={'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'}
                                >
                                  <ExitToApp className='mr-3 text-gray-700'/>
                                  Logout
                                </Link>
                            </Menu.Item>  
                          </Menu.Items>
                        </Transition>
                      </>
                    ) : null
                  }
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-inherit z-10 overflow-hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.to;
                return(
                  <Disclosure.Button
                    key={item.name}
                    className={classNames(
                      isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                  >
                    <Link to={item.to}>
                      {item.name}
                    </Link>
                  </Disclosure.Button>  
                )
              })}
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-700 px-2 space-y-1">
                {isAdmin || isCustomer ?   (
                  <> 
                    {isAdmin ? null : (
                      <>
                        <Disclosure.Button
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Link to="/orders">
                            <HistoryOutlined className='mr-3 '/>
                            My Orders
                          </Link>
                        </Disclosure.Button>    
                        <Disclosure.Button
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Link to="/profile/overview">
                            <AccountCircleOutlined className='mr-3'/>
                            Profile
                          </Link>
                        </Disclosure.Button> 
                      </>
                    )}   
                      <Disclosure.Button
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={logoutBtnClicked}
                      >
                        <ExitToApp className='mr-3'/>
                        Logout
                      </Disclosure.Button>              
                  </>
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      size='large' 
                      sx={{marginTop: 0.35, marginLeft:1, background:"#00C2BE", color:"#000000", "&:hover":{backgroundColor:"#029592"}}}
                    >
                      <Link to="/signup">
                        Sign UP
                      </Link>
                    </Button>
                    <Button 
                      variant="outlined" 
                      size='large' 
                      sx={{marginLeft:1, borderColor:"#00C2BE", color:"#00C2BE", "&:hover":{borderColor:"#029592"}}}
                    >
                      <Link to="/login">
                        Log In
                      </Link>
                    </Button>
                  </>
                )}
            </div>  
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    </div>
  )
}

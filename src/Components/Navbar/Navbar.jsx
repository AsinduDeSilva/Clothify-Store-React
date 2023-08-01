import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../../assets/logo.jpg';
import { AccountCircleOutlined, Height, ShoppingCartOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';



const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Latest', href: '#', current: false },
  { name: 'Men', href: '#', current: false },
  { name: 'Women', href: '#', current: false },
  { name: 'Kids', href: '#', current: false },
  { name: 'Accessories', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Navbar() {

  const[isLogged, setLogin] = useState(false);

  function test(){
    console.log("Clicked");
  }

  return (
    <div className="sticky top-0 overflow-hidden z-50">
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
                <div className="hidden md:ml-6 lg:ml-16 md:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-1 py-2 text-md font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 ">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white  "
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <ShoppingCartOutlined className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 hidden md:block p-1 ">
                  <div >
                    <Menu.Button onClick={!isLogged ? test : null} className="relative flex rounded-full bg-gray-800 text-gray-400 p-1 hover:text-white scale-[1.15]">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <AccountCircleOutlined aria-hidden="true" className="h-8 w-8 rounded-full" />
                      
                    </Menu.Button>
                  </div>
                  {
                    isLogged ? (
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md  bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {( active ) => (
                                <a
                                  href="#"
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {( active ) => (
                                <a
                                  href="#"
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Settings
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {( active ) => (
                                <a
                                  href="#"
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Sign out
                                </a>
                              )}
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
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-700 px-2 space-y-1">
                {isLogged ?   (
                  <> 
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      Settings
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      Sign out
                    </Disclosure.Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" size='large' sx={{marginTop: 0.35, marginLeft:1, background:"#00C2BE", color:"#000000", "&:hover":{backgroundColor:"#029592"}}}>Sign UP</Button>
                    <Button variant="outlined" size='large' sx={{marginLeft:1, borderColor:"#00C2BE", color:"#00C2BE", "&:hover":{borderColor:"#029592"}}}>Log IN</Button>
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

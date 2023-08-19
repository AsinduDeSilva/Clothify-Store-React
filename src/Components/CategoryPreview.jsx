import React from 'react'
import { Link } from 'react-router-dom'


const categories = [
  {
    name: 'Latest',
    to: '/products/latest',
    imageSrc: 'https://img.freepik.com/free-photo/business-partners-together-office_1303-25415.jpg?size=626&ext=jpg&ga=GA1.2.1834365907.1682589117&semt=ais',
  },
  {
    name: 'Men',
    to: '/products/men',
    imageSrc: 'https://img.freepik.com/premium-photo/handsome-confident-blond-bearded-businessman-with-hands-pockets-smiling-joyfully-give-professional-vibe-discussing-business-double-his-income-become-successful-white-background_1258-5820.jpg?size=626&ext=jpg&ga=GA1.2.1834365907.1682589117&semt=sph',
  },
  {
    name: 'Women',
    to: '/products/women',
    imageSrc: 'https://img.freepik.com/premium-photo/adorable-cosmetologist-with-clear-skin-wearing-black-medical-uniform-posing-indoors-isolated-grey-studio-background_7502-6856.jpg?size=626&ext=jpg&ga=GA1.2.1834365907.1682589117&semt=sph',
  },
  {
    name: 'Kids',
    to: '/products/kids',
    imageSrc: 'https://img.freepik.com/free-photo/banner-with-surprised-children-peeking-edge_155003-12206.jpg?size=626&ext=jpg&ga=GA1.2.1834365907.1682589117&semt=sph',
  },
  { 
    name: 'Accessories', 
    to: '/products/accessories', 
    imageSrc: 'https://img.freepik.com/free-photo/top-view-accessoires-travel-with-man-clothing-concept-bow-tie-wallet-wooden-background-watch-sunglasses-bag-hat-belt-shoes-wood-table_1921-94.jpg?size=626&ext=jpg&ga=GA1.2.1834365907.1682589117&semt=sph' 
  },
]

export default function Homepage() {
    return (
      <div className="bg-white">
        <div className="py-16 sm:py-20 xl:max-w-[1470px] xl:mx-auto xl:px-8">
          <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
          </div>
  
          <div className="mt-6 flow-root">
            <div className="-my-2">
              <div className="box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible">
                <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.to}
                      className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <img src={category.imageSrc} alt="" className="w-full h-full object-center object-cover" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          
        </div>
      </div>
    )
  }
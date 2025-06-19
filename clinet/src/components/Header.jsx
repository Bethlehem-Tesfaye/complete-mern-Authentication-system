import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {

    const {userData} = useContext(AppContent);
    return (
        <div className='flex flex-col justify-center items-center mt-20 px-6 text-center text-gray-700'>
            <img className='w-32 h-32 rounded-full mb-4 shadow-md' src={assets.header_img} alt="header img" />
            <h1 className='flex items-center gap-2 text-lg font-semibold mb-2'>
                Hey {userData ? userData.name : "Developer"}!
                <img className='w-7 h-7' src={assets.hand_wave} alt="handwave" />
            </h1>
            <h2 className='text-3xl sm:text-4xl font-bold mb-3 text-gray-900'>Welcome to Our App</h2>
            <p className='mb-6 max-w-md text-sm text-gray-600'>Take a quick tour to get familiar — you'll be set up and ready to go in no time.</p>
<button className='bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-all duration-200'>
                Get Started
            </button>
        </div>
    )
}

export default Header

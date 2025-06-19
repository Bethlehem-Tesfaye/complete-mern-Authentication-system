import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

// Import FaHome icon
import { FaHome } from 'react-icons/fa'

const NavBar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setIsloggedin, setUserData } = useContext(AppContent)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true // to send cookies
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/email-vertify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true // to send cookies
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsloggedin(false)
        setUserData(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-between p-7 w-full items-center">
      {/* Home text with icon */}
      <FaHome
        className=" sm:left-20 top-5 w-10 h-10 text-red-400 cursor-pointer"
        onClick={() => navigate('/')}
        aria-label="Home"
      />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute w-27 hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVertified && (
                <li
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => sendVerificationOtp()}
                >
                  Verify Email
                </li>
              )}
              <li className="px-2 py-1 hover:bg-gray-200 cursor-pointer" onClick={() => logout()}>
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex gap-2 items-center justify-center border border-gray-500 p-2 pr-6 pl-6 rounded-3xl hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="arrow icon" />
        </button>
      )}
    </div>
  )
}

export default NavBar

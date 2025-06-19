import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaHome } from 'react-icons/fa'

axios.defaults.withCredentials = true;


const EmailVertify = () => {
  axios.defaults.withCredentials = true
  const { backendUrl, setIsloggedin, getUserData, userData } = useContext(AppContent)
  const navigate = useNavigate()
  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
        if (index === pasteArray.length - 1) inputRefs.current[index].focus()
      }
    })
    e.preventDefault()
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map((el) => el.value)
      const otp = otpArray.join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setIsloggedin && userData && userData.isAccountVertified && navigate('/')
  }, [setIsloggedin, userData])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-red-200 to-yellow-200 px-4 sm:px-0">
      <FaHome
        className="absolute left-2 sm:left-20 top-5 w-10 h-10 text-red-400 cursor-pointer"
        onClick={() => navigate('/')}
        aria-label="Home"
      />
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-2xl font-semibold text-red-600 text-center mb-4">Email Verify</h1>
        <p className="text-center mb-6 text-red-400">Enter the 6-digit code sent to your email address</p>
        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-yellow-100 text-red-600 text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-red-300"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 text-black rounded-full font-semibold hover:brightness-105 transition duration-200">
          Verify Email
        </button>
      </form>
    </div>
  )
}

export default EmailVertify

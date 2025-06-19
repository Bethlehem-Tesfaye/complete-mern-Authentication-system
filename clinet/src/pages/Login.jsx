import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaHome } from 'react-icons/fa'

axios.defaults.withCredentials = true;

const Login = () => {
  const [state, setState] = useState('Sign up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, setIsloggedin, getUserData } = useContext(AppContent)

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true

      if (state === 'Sign up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsloggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsloggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-2 sm:px-0 bg-gradient-to-br from-yellow-100 via-red-200 to-yellow-200">
      <FaHome
        className="absolute left-2 sm:left-20 top-5 w-10 h-10 text-red-400 cursor-pointer"
        onClick={() => navigate('/')}
        aria-label="Home"
      />

      <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:w-96 text-black">
        <h2 className="text-3xl font-semibold text-red-600 text-center mb-3">{state === 'Sign up' ? 'Create account' : 'Login'}</h2>
        <p className="text-center text-red-400 mb-6">{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-yellow-100">
              <img src={assets.person_icon} alt="person icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-black placeholder-red-300"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-yellow-100">
            <img src={assets.mail_icon} alt="mail icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-black placeholder-red-300"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-yellow-100">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-black placeholder-red-300"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            className="mb-4 text-red-500 cursor-pointer hover:underline"
            onClick={() => navigate('/reset-password')}
          >
            forgot password?
          </p>

          <button className="w-full py-2.5 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 text-black font-semibold rounded-full hover:brightness-105 transition duration-200">
            {state}
          </button>
        </form>

        {state === 'Sign up' ? (
          <p className="text-red-400 text-center text-xs mt-4">
            Already have an account?{' '}
            <span
              className="text-red-600 cursor-pointer underline"
              onClick={() => setState('Login')}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-red-400 text-center text-xs mt-4">
            Don't have an account?{' '}
            <span
              className="text-red-600 cursor-pointer underline"
              onClick={() => setState('Sign up')}
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import EmailVertify from './pages/EmailVertify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div className=''>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-vertify' element={<EmailVertify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App
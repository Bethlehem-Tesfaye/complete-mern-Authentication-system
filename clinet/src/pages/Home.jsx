import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/header'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-red-50 to-yellow-50 overflow-visible">
      <NavBar />
      <Header />
    </div>
  )
}

export default Home

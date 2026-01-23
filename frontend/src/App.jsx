// React এবং প্রয়োজনীয় components import করা
import React from 'react'
import './App.css' // Global CSS styles
import Navbar from './components/Navbar' // Navigation component
import { Outlet } from 'react-router' // Nested routes render করার জন্য
import { BookProvider } from './context/BookContext' // Book context provider
import Footer from './components/Footer' // Footer component

// Main App component - পুরো application এর layout structure
function App() {
  return (
    <>
    {/* Book context provider - সব child components book data access করতে পারবে */}
    <BookProvider>
      {/* Top navigation bar */}
      <Navbar/>
      {/* Main content area - routes এর components এখানে render হবে */}
      <main className='min-h-[calc(100vh-100px)] mt-16'>
        <Outlet/> {/* React Router outlet - current route component show করবে */}
      </main>
      {/* Bottom footer */}
      <Footer/>
    </BookProvider>
    </>
  )
}

// App component export করা
export default App

// React এবং routing এর জন্য প্রয়োজনীয় imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Global CSS styles
import App from "./App.jsx"; // Main App component
import { BrowserRouter, Route, Routes } from "react-router"; // Routing components

// সব page components import করা
import Home from "./pages/home/Home.jsx"; // Home page
import Shop from "./pages/shop/Shop.jsx"; // All books page
import BookDetails from "./pages/singlebooks/BookDetails.jsx"; // Single book details
import EditBook from "./pages/editBook/EditBook.jsx"; // Book edit page
import AddBook from "./pages/addBook/AddBook.jsx"; // Add new book page

// Toast notifications এর জন্য
import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';

// Authentication related imports
import Login from "./pages/authPage/Login.jsx"; // Login page
import AuthProvider from "./providers/AuthProvider.jsx"; // Auth context provider
import Register from "./pages/authPage/Register.jsx"; // Registration page

// Other pages
import Cart from "./pages/Cart/Cart.jsx"; // Shopping cart
import CheckoutPage from "./pages/checkout/Checkout.jsx"; // Checkout process
import About from "./pages/About/About.jsx"; // About page
import Contact from "./pages/About/Contact.jsx"; // Contact page

// Admin dashboard components
import Dashboard from "./components/Dashboard/Dashboard.jsx"; // Main dashboard layout
import AdminDashboard from "./components/Dashboard/Adminashboard.jsx"; // User management
import AllBooks from "./components/Dashboard/AllBooks.jsx"; // Book management
import AddNewBooks from "./components/Dashboard/AddNewBooks.jsx"; // Add new book form

// Application শুরু করা - DOM এ render করা
createRoot(document.getElementById("root")).render(
  // Browser router - URL based routing এর জন্য
  <BrowserRouter>
    {/* Authentication context - সব components authentication state access করতে পারবে */}
    <AuthProvider>
      {/* Toast notifications container */}
      <ToastContainer />
      
      {/* Application routes define করা */}
     <Routes>
        {/* Main app layout routes */}
        <Route element={<App />}>
          <Route path="/" element={<Home />} />                    {/* Home page */}
          <Route path="/books" element={<Shop />} />               {/* All books listing */}
          <Route path="/books/:id" element={<BookDetails />} />    {/* Single book details */}
          <Route path="/books/edit/:id" element={<EditBook />} />  {/* Edit book form */}
          <Route path="/books/add" element={<AddBook />} />        {/* Add new book */}
          <Route path="/auth/login" element={<Login />} />         {/* User login */}
          <Route path="/auth/register" element={<Register />} />   {/* User registration */}
          <Route path="/user/cart" element={<Cart />} />           {/* Shopping cart */}
          <Route path="/user/checkout" element={<CheckoutPage />} /> {/* Checkout process */}
          <Route path="/about" element={<About />} />              {/* About page */}
          <Route path="/contact" element={<Contact />} />          {/* Contact page */}
        </Route>
        
        {/* Admin dashboard routes - separate layout */}
        <Route path="/dashboard" element={<Dashboard />}>
            <Route path="users" element={<AdminDashboard />} />     {/* User management */}
            <Route path="books" element={<AllBooks />} />           {/* Book management */}
            <Route path="add-book" element={<AddNewBooks />} />     {/* Add new book */}
          </Route>
      </Routes>
      
      {/* Modern toast notifications */}
      <Toaster richColors position="top-center" />
    </AuthProvider>
  </BrowserRouter>
);

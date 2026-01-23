// React hooks এবং প্রয়োজনীয় libraries import করা
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // HTTP requests এর জন্য
import { AuthContext } from '../../providers/AuthProvider'; // Authentication context
import { baseUrl } from '../../utils/baseUrl'; // API base URL
import { useNavigate } from 'react-router-dom'; // Navigation এর জন্য
import { toast } from 'sonner'; // Toast notifications

// Admin নতুন book add করার component
const AddNewBooks = () => {
  // Authentication context থেকে user info এবং token function
  const { user, getToken } = useContext(AuthContext);
  const navigate = useNavigate(); // Page navigation এর জন্য
  
  // Form data state - সব input fields এর values
  const [form, setForm] = useState({
    title: '',        // বইয়ের নাম
    author: '',       // লেখকের নাম
    publishedYear: '', // প্রকাশের বছর
    genre: '',        // বইয়ের ধরন
    price: '',        // দাম
    description: '',  // বর্ণনা
    bookUrl: '',      // বইয়ের URL
    imageUrl: '',     // ছবির URL
  });
  
  // Loading states
  const [loading, setLoading] = useState(false);           // Form submit loading
  const [fetchLoading, setFetchLoading] = useState(false); // Books fetch loading
  const [error, setError] = useState('');                  // Error messages
  const [success, setSuccess] = useState('');              // Success messages
  const [books, setBooks] = useState([]);                  // Available books list

  // Form input change handle করার function
  const handleChange = (e) => {
    const { name, value } = e.target; // Input field এর name এবং value
    setForm((prev) => ({ ...prev, [name]: value })); // State update করা
  };

  // URL validation function - valid URL কিনা check করা
  const isValidUrl = (url) => {
    if (!url) return true; // Empty URL allow করা
    try {
      new URL(url); // URL constructor দিয়ে validate করা
      return true;
    } catch {
      return false; // Invalid URL
    }
  };

  // Form submit handle করার main function
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submit prevent করা
    setError('');   // Previous error clear করা
    setSuccess(''); // Previous success message clear করা

    // User logged in আছে কিনা check করা
    if (!user) {
      setError('Please log in to add a book.');
      navigate('/auth/login'); // Login page এ redirect করা
      return;
    }

    // Client-side validation - অবশ্যক fields check করা
    if (!form.title || !form.author || !form.price) {
      setError('Title, author, and price are required.');
      return;
    }

    setLoading(true); // Loading state start করা
    try {
      // User token get করা authentication এর জন্য
      const token = await getToken();
      
      // API এ send করার জন্য payload prepare করা
      const payload = {
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        price: Number(form.price),
      };

      // ✅ STEP 1: Backend API এ POST request পাঠানো
      // এই request টা backend এর POST /books route এ যাবে
      const response = await axios.post(`${baseUrl}/books`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ STEP 2: Database এ book successfully save হয়েছে
      console.log('Book saved to database:', response.data);

      // Success response handle করা
      setSuccess('Book added successfully!');
      toast.success('Book added successfully!');
      
      // Form reset করা
      setForm({
        title: '', author: '', publishedYear: '', genre: '',
        price: '', description: '', bookUrl: '', imageUrl: '',
      });
      
      // ✅ STEP 3: Frontend এ book list refresh করা
      // এই function টা আবার API call করে updated book list নিয়ে আসবে
      fetchBooks();
    } catch (err) {
      // Error handling
      const errorMsg = err.response?.data?.error || 'Failed to add book. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false); // Loading state end করা
    }
  };

  // Available books fetch করার function
  const fetchBooks = async () => {
    setFetchLoading(true); // Loading state start
    try {
      // ✅ STEP 4: Public books API call করা
      // এই API call টা backend এর GET /books route এ যাবে
      // এবং database থেকে সব books (নতুন book সহ) return করবে
      const response = await axios.get(`${baseUrl}/books`);
      console.log('Fetched Books from API:', response.data);
      
      // ✅ STEP 5: Books state update করা
      // এখানে নতুন added book টাও থাকবে
      setBooks(response.data.books || response.data);
      
      console.log('Books state updated with new book');
    } catch (err) {
      // Error handling
      console.error('Error fetching books:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError('Failed to fetch books. Please try again.');
    } finally {
      setFetchLoading(false); // Loading state end
    }
  };

  // Component mount হওয়ার সময় books fetch করা
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-amber-200">
      <h2 className="text-3xl font-extrabold text-amber-800 text-center mb-6">
        Add a New Book
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-300 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-300 animate-fade-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="Enter book title"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-1">
              Author <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label htmlFor="publishedYear" className="block text-sm font-semibold text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              value={form.publishedYear}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="e.g., 2023"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="e.g., Fiction, Non-Fiction"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
              Price ($) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="e.g., 19.99"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="bookUrl" className="block text-sm font-semibold text-gray-700 mb-1">
              Book URL
            </label>
            <input
              type="text"
              id="bookUrl"
              name="bookUrl"
              value={form.bookUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="Enter book description"
            rows="5"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md font-semibold text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-amber-800 mb-4">Available Books</h3>
        {fetchLoading ? (
          <p className="text-gray-600">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-600">No books available.</p>
        ) : (
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book._id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="text-lg font-semibold">{book.title}</h4>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600">Price: ${book.price}</p>
                {book.genre && <p className="text-gray-600">Genre: {book.genre}</p>}
                {book.publishedYear && <p className="text-gray-600">Published: {book.publishedYear}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddNewBooks;
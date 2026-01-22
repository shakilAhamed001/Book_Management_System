import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../providers/AuthProvider';
import { baseUrl } from '../../utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddNewBooks = () => {
  const { user, getToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
    price: '',
    description: '',
    bookUrl: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [books, setBooks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    if (!url) return true; // Allow empty URLs
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Base URL:', baseUrl);
    console.log('User:', user);

    if (!user) {
      setError('Please log in to add a book.');
      navigate('/auth/login');
      return;
    }

    // Client-side validation
    if (!form.title || !form.author || !form.price) {
      setError('Title, author, and price are required.');
      return;
    }
    if (form.publishedYear && isNaN(form.publishedYear)) {
      setError('Published year must be a valid number.');
      return;
    }
    if (isNaN(form.price)) {
      setError('Price must be a valid number.');
      return;
    }
    if (form.bookUrl && !isValidUrl(form.bookUrl)) {
      setError('Book URL must be a valid URL.');
      return;
    }
    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      setError('Image URL must be a valid URL.');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const payload = {
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        price: Number(form.price),
      };
      console.log('Request Payload:', payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('Axios Config:', config);

      const response = await axios.post(`${baseUrl}/books`, payload, config);
      console.log('Response Data:', response.data);

      setSuccess('Book added successfully!');
      toast.success('Book added successfully!');
      setForm({
        title: '',
        author: '',
        publishedYear: '',
        genre: '',
        price: '',
        description: '',
        bookUrl: '',
        imageUrl: '',
      });
      // Refresh book list
      fetchBooks();
    } catch (err) {
      console.error('Error adding book:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      const errorMsg = err.response?.data?.error || 'Failed to add book. Please try again.';
      setError(errorMsg);
      if (errorMsg.includes('auth/id-token-expired')) {
        setError('Your session has expired. Please log in again.');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/books`);
      console.log('Fetched Books:', response.data);
      setBooks(response.data.books || []);
    } catch (err) {
      console.error('Error fetching books:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError('Failed to fetch books. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

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
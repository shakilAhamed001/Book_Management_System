import React, { useEffect, useState } from 'react';
import BookGrid from './BookGrid';
import axios from 'axios';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/books');
      setBooks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ DELETE HANDLER (this fixes your error)
  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      alert('Book deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete book');
    }
  };

  if (loading) return <p className="text-center py-10">Loading books...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="py-8 md:px-4">
        <BookGrid
          books={books}
          loading={loading}
          error={error}
          onDeleteBook={handleDeleteBook}
        />
      </div>
    </div>
  );
};

export default Shop;

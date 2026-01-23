// React hooks import করা
import React, { useEffect, useState } from 'react';
import BookGrid from './BookGrid'; // Book display grid component
import axios from 'axios'; // HTTP requests এর জন্য

// Shop page component - সব books display করার জন্য
const Shop = () => {
  // Component states
  const [books, setBooks] = useState([]);        // All books list
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  // ✅ STEP 6: Shop page এ books fetch করার function
  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // ✅ Backend API call - সব books নিয়ে আসা
      // এই API call টা backend এর GET /books route এ যাবে
      // Database থেকে সব books (নতুন added book সহ) return করবে
      const res = await axios.get('http://localhost:3000/books');
      
      // ✅ Books state update করা - নতুন book টাও এখানে থাকবে
      setBooks(res.data);
      setError(null);
      
      console.log('Shop page: Books loaded including new book:', res.data.length);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Shop page: Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 7: Component mount হওয়ার সময় books fetch করা
  // User যখন shop page এ আসবে, তখন এই useEffect run হবে
  useEffect(() => {
    fetchBooks(); // সব books load করা (নতুন book সহ)
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

  // Loading এবং error states handle করা
  if (loading) return <p className="text-center py-10">Loading books...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="py-8 md:px-4">
        {/* ✅ STEP 8: BookGrid component এ books pass করা */}
        {/* এখানে সব books (নতুন added book সহ) display হবে */}
        <BookGrid
          books={books}           // সব books array (including নতুন book)
          loading={loading}       // Loading state
          error={error}          // Error state
          onDeleteBook={handleDeleteBook} // Delete function
        />
      </div>
    </div>
  );
};

export default Shop;

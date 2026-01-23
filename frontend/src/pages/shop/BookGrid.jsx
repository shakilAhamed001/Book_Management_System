// React এবং BookCard component import
import React from "react";
import BookCard from "./BookCard"; // Individual book card component

// Placeholder image for books without image
const placeholderImage = "https://via.placeholder.com/150";

// BookGrid component - books গুলো grid layout এ display করার জন্য
const BookGrid = ({ books, loading, error, onDeleteBook }) => {
  // Error state handle করা
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  // Loading state handle করা
  if (loading)
    return (
      <div className="text-gray-500 min-h-[50vh] text-center py-20">
        Loading books...
      </div>
    );

  // Empty books array handle করা
  if (!books || books.length === 0)
    return (
      <div className="col-span-full text-center text-gray-500 py-36">
        No books found in this category.
      </div>
    );

  // Image URL validation helper function
  const getValidImage = (url) => {
    if (!url) return placeholderImage;
    // Invalid URLs রিজেক্ট করা
    if (url.includes("…") || url.includes(" ")) return placeholderImage;
    return url;
  };

  return (
    // ✅ STEP 9: Grid layout এ সব books render করা
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {/* ✅ STEP 10: প্রতিটি book এর জন্য BookCard component render করা */}
      {books.map((book) => (
        <BookCard
          key={book._id}                                    // Unique key
          book={{ ...book, image: getValidImage(book.image) }} // Book data with valid image
          onDelete={onDeleteBook}                           // Delete function
        />
      ))}
      {/* এখানে নতুন added book টাও একটা BookCard হিসেবে render হবে */}
    </div>
  );
};

export default BookGrid;

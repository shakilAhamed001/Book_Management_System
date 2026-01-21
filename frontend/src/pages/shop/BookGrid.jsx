import React from "react";
import BookCard from "./BookCard";

const placeholderImage = "https://via.placeholder.com/150";

const BookGrid = ({ books, loading, error, onDeleteBook }) => {
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  if (loading)
    return (
      <div className="text-gray-500 min-h-[50vh] text-center py-20">
        Loading books...
      </div>
    );

  if (!books || books.length === 0)
    return (
      <div className="col-span-full text-center text-gray-500 py-36">
        No books found in this category.
      </div>
    );

  // Helper function to sanitize image URLs
  const getValidImage = (url) => {
    if (!url) return placeholderImage;
    // reject URLs containing ellipsis or whitespace
    if (url.includes("…") || url.includes(" ")) return placeholderImage;
    return url;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={{ ...book, image: getValidImage(book.image) }}
          onDelete={onDeleteBook}
        />
      ))}
    </div>
  );
};

export default BookGrid;

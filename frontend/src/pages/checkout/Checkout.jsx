import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const CheckoutPage = () => {
  const { user, logOutUser, cart } = useContext(AuthContext);
  const [mycart, setMyCart] = useState([]);
console.log({cart})
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // console.log({ mycart })
  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get(`${baseUrl}/cart`);
      const result = response.data.filter(item => item.userEmail == user.email);
      setMyCart(result);
    };
    if (user?.email) { // To ensure user is loaded
      fetchCart();
    }
  }, [user]);

  const totalPrice = mycart.reduce(
    (acc, book) => acc + book.price * book.quantity,
    0
  );

  return (
    <div className="min-h-screen  bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: User Details Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Billing Information
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="you@example.com"
                defaultValue={mycart[0]?.userEmail}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Dhaka"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="1207"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Confirm Details
            </button>
          </form>
        </div>

        {/* Right: Cart Summary */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
          {cart.map((book) => (
            <div
              key={book.bookId}
              className="flex gap-4 border-b border-gray-200 pb-4 mb-4"
            >
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">by {book.author}</p>
                <p className="text-sm text-gray-600 italic">
                  Published: {book.publishedYear}
                </p>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {book.description}
                </p>
                <p className="text-green-700 font-bold mt-2">
                  ${book.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-700">${totalPrice.toFixed(2)}</span>
          </div>

          <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-300">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

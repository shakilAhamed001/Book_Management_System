import React from 'react';
import Navbar from '../../components/Navbar';
import { FaUser, FaEnvelope, FaCommentDots } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="w-full bg-[url('https://i.ibb.co/TM5BZw8N/image.png')] bg-black/80 bg-cover bg-center py-24">
        <div className="bg-white/90 max-w-4xl mx-auto p-10 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-md">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Contact Gyan Griho</h2>
          <p className="text-center text-gray-600 mb-10">
            We'd love to hear from you! Got questions about books, orders, or anything else? Drop us a message.
          </p>

          <form className="grid grid-cols-1 gap-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-semibold mb-1">
                Your Name
              </label>
              <div className="flex items-center border border-black rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-gray-800">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <div className="flex items-center border border-black rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-gray-800">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="message" className="block text-sm font-semibold mb-1">
                Your Message
              </label>
              <div className="flex items-start border border-black rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-gray-800">
                <FaCommentDots className="text-gray-500 mt-1 mr-2" />
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                  className="w-full bg-transparent outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

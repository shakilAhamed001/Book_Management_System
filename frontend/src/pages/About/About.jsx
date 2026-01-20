import React from 'react';
import Navbar from '../../components/Navbar';

const About = () => {
  return (
    <div>
      <Navbar />
      <div
        className="relative bg-cover bg-center min-h-screen pt-32 pb-20 px-4 md:px-10"
        style={{
          backgroundImage: "url('https://i.ibb.co/ks8L1Wy4/image.png')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60  z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-white">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8">
            About <span className="text-amber-500">Gyan Griho</span>
          </h1>

          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            At <strong>Gyan Griho</strong>, we believe that books are more than just paper and ink — they are vessels of knowledge, gateways to imagination, and tools of transformation.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-amber-400">📚 Who We Are</h2>
              <p className="text-white text-base md:text-lg leading-relaxed">
                Gyan Griho is a one-stop online bookshop dedicated to bringing readers a carefully curated collection of books. Whether you're a student, a fiction lover, a researcher, or someone looking to explore new ideas, we offer books tailored to your taste. From bestsellers to hidden gems, we celebrate the written word in all its forms.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-amber-400">🚀 Our Vision & Mission</h2>
              <p className="text-white text-base md:text-lg leading-relaxed">
                We envision a community where learning never stops. Our mission is to inspire, educate, and empower through books. We strive to make reading accessible, enjoyable, and affordable for everyone by blending traditional book culture with modern convenience.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">💡 Why Choose Gyan Griho?</h2>
            <ul className="text-white text-base md:text-lg space-y-2 max-w-3xl mx-auto">
              <li>✔️ Vast and diverse book collection for all age groups</li>
              <li>✔️ Competitive prices, discounts, and bundle offers</li>
              <li>✔️ Fast, reliable delivery across the country</li>
              <li>✔️ Personalized book recommendations</li>
              <li>✔️ Easy returns and excellent customer service</li>
              <li>✔️ A community-driven platform for readers and learners</li>
            </ul>
          </div>

          <div className="mt-16 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">🌍 Our Promise</h2>
            <p className="text-white text-base md:text-lg leading-relaxed">
              Gyan Griho is more than a bookstore. It’s a movement toward creating a culture where every individual, regardless of background, has access to the world’s knowledge. Join us in this journey of curiosity, creativity, and growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

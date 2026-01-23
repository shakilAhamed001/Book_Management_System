// Express server এবং প্রয়োজনীয় packages import করা
const express = require('express');
const cors = require('cors'); // Cross-origin requests এর জন্য
require('dotenv').config(); // Environment variables load করার জন্য
const { ObjectId } = require('mongodb'); // MongoDB ObjectId এর জন্য

// Database এবং models import করা
const connectDB = require('./config/db');
const bookSchema = require('./models/book.model');
const cartSchema = require('./models/cart.model');

// Express app তৈরি করা এবং port set করা
const app = express();
const port = process.env.PORT || 3000; // Environment থেকে port নিয়ে আসা, না থাকলে 3000

// Middleware setup করা
app.use(cors()); // সব domain থেকে request allow করা
app.use(express.json()); // JSON data parse করার জন্য

/* ===== DATABASE CONNECTION ===== */
(async () => {
  // Database এর সাথে connection establish করা
  const db = await connectDB();
  // Collections এর reference নিয়ে আসা
  const booksCollection = db.collection('books');
  const cartCollection = db.collection('cart');

  /* ===== ROOT ENDPOINT ===== */
  // API এর home route - server চালু আছে কিনা check করার জন্য
  app.get('/', (req, res) => {
    res.send('📚 Book Management API');
  });

  // Public book create route (কেউই book add করতে পারবে)
  app.post('/books', async (req, res) => {
    const data = req.body; // Frontend থেকে আসা data

    // Basic validation - title এবং author অবশ্যই থাকতে হবে
    if (!data.title || !data.author) {
      return res.status(400).json({ error: 'Title and author required' });
    }

    // Book object তৈরি করা timestamp সহ
    const book = {
      ...data, // সব data spread করা
      createdAt: new Date(), // তৈরির সময়
      updatedAt: new Date(), // আপডেটের সময়
    };

    // Database এ book save করা
    const result = await booksCollection.insertOne(book);
    res.status(201).json({ message: 'Book created', id: result.insertedId });
  });

  /* ================= PUBLIC BOOK ROUTES ================= */
  // এই routes গুলো সবাই access করতে পারবে (authentication লাগবে না)

  // সব books দেখার জন্য (public access)
  app.get('/books', async (req, res) => {
    const books = await booksCollection.find().toArray(); // Database থেকে সব books নিয়ে আসা
    res.json(books); // JSON format এ response পাঠানো
  });

  // একটা specific book দেখার জন্য (public access)
  app.get('/books/:id', async (req, res) => {
    // URL parameter থেকে ID নিয়ে valid কিনা check করা
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    // Database থেকে specific book খুঁজে আনা
    const book = await booksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    // Book না পাওয়া গেলে 404 error
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book); // Book পাওয়া গেলে response পাঠানো
  });
  
  // Public book delete route
  app.delete('/books/:id', async (req, res) => {
    // ID validation
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    // Database থেকে book delete করা
    await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Book deleted' });
  });

  /* ================= ADMIN BOOK ROUTES ================= */
  // এই routes গুলো শুধু admin রা access করতে পারবে
  // TODO: পরে authentication middleware add করতে হবে real admin check এর জন্য

  // Admin সব books দেখার জন্য
  app.get('/admin/books', async (req, res) => {
    const books = await booksCollection.find().toArray(); // সব books নিয়ে আসা
    res.json(books); // JSON format এ response পাঠানো
  });

  // Admin নতুন book add করার জন্য
  app.post('/admin/books', async (req, res) => {
    const data = req.body; // Frontend থেকে আসা book data

    // Validation - title আর author অবশ্যই থাকতে হবে
    if (!data.title || !data.author) {
      return res.status(400).json({ error: 'Title and author required' });
    }

    // Book object তৈরি করা timestamp সহ
    const book = {
      ...data, // সব data spread করা (title, author, price, description etc.)
      createdAt: new Date(), // কখন তৈরি হলো
      updatedAt: new Date(), // কখন update হলো
    };

    // MongoDB তে book insert করা
    const result = await booksCollection.insertOne(book);
    res.status(201).json({ message: 'Book created', id: result.insertedId });
  });

  // Admin existing book update করার জন্য
  app.put('/admin/books/:id', async (req, res) => {
    // URL থেকে আসা ID valid কিনা check করা
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    // MongoDB তে book update করা
    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) }, // কোন book update করবে
      { $set: { ...req.body, updatedAt: new Date() } } // কি update করবে + timestamp
    );

    res.json({ message: 'Book updated' });
  });

  // Admin book delete করার জন্য
  app.delete('/admin/books/:id', async (req, res) => {
    // URL থেকে আসা ID valid কিনা check করা
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    // Books collection থেকে book delete করা
    await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    // Cart থেকেও সেই book এর সব item remove করা
    await cartCollection.deleteMany({ bookId: new ObjectId(req.params.id) });

    res.json({ message: 'Book deleted' });
  });

  /* ================= SHOPPING CART ROUTES ================= */
  // User দের shopping cart manage করার জন্য

  // User এর cart এর সব items দেখার জন্য
  app.get('/cart', async (req, res) => {
    const cart = await cartCollection.find().toArray(); // Cart collection থেকে সব items
    res.json(cart); // JSON response
  });

  // Cart এ নতুন book add করার জন্য
  app.post('/cart', async (req, res) => {
    const { bookId, quantity } = req.body; // Frontend থেকে bookId এবং quantity

    // Book ID valid কিনা check করা
    if (!ObjectId.isValid(bookId))
      return res.status(400).json({ error: 'Invalid book ID' });

    // Cart item object তৈরি করা
    const cartItem = cartSchema(bookId, quantity);
    // Database এ cart item save করা
    await cartCollection.insertOne(cartItem);

    res.status(201).json({ message: 'Added to cart', item: cartItem });
  });

  // Cart থেকে item remove করার জন্য
  app.delete('/cart/:id', async (req, res) => {
    // Cart item ID valid কিনা check করা
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    // Database থেকে cart item delete করা
    await cartCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Cart item removed' });
  });

  /* ================= SERVER START ================= */
  // Server কে specified port এ চালু করা
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})(); // IIFE (Immediately Invoked Function Expression) - function টা সাথে সাথেই execute হবে

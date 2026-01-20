const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { ObjectId } = require('mongodb');

const connectDB = require('./config/db');
const bookSchema = require('./models/book.model');
const cartSchema = require('./models/cart.model');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ===== CONNECT DB ===== */
(async () => {
  const db = await connectDB();
  const booksCollection = db.collection('books');
  const cartCollection = db.collection('cart');

  /* Root */
  app.get('/', (req, res) => {
    res.send('📚 Book Management API');
  });

  app.post('/books', async (req, res) => {
    const data = req.body;

    if (!data.title || !data.author) {
      return res.status(400).json({ error: 'Title and author required' });
    }

    const book = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await booksCollection.insertOne(book);
    res.status(201).json({ message: 'Book created', id: result.insertedId });
  });

  /* ================= PUBLIC BOOK ROUTES ================= */

  // Get all books (public)
  app.get('/books', async (req, res) => {
    const books = await booksCollection.find().toArray();
    res.json(books);
  });

  // Get single book (public)
  app.get('/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    const book = await booksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  });
  app.delete('/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Book deleted' });
  });

  /* ================= ADMIN BOOK ROUTES ================= */
  // TODO: Add auth middleware later for real admin check

  // Get all books (admin)
  app.get('/admin/books', async (req, res) => {
    const books = await booksCollection.find().toArray();
    res.json(books);
  });

  // Create book
  app.post('/admin/books', async (req, res) => {
    const data = req.body;

    if (!data.title || !data.author) {
      return res.status(400).json({ error: 'Title and author required' });
    }

    const book = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await booksCollection.insertOne(book);
    res.status(201).json({ message: 'Book created', id: result.insertedId });
  });

  // Update book
  app.put('/admin/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    res.json({ message: 'Book updated' });
  });

  // Delete book
  app.delete('/admin/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    await cartCollection.deleteMany({ bookId: new ObjectId(req.params.id) });

    res.json({ message: 'Book deleted' });
  });

  /* ================= CART ================= */

  // Get cart
  app.get('/cart', async (req, res) => {
    const cart = await cartCollection.find().toArray();
    res.json(cart);
  });

  // Add to cart
  app.post('/cart', async (req, res) => {
    const { bookId, quantity } = req.body;

    if (!ObjectId.isValid(bookId))
      return res.status(400).json({ error: 'Invalid book ID' });

    const cartItem = cartSchema(bookId, quantity);
    await cartCollection.insertOne(cartItem);

    res.status(201).json({ message: 'Added to cart', item: cartItem });
  });

  // Remove cart item
  app.delete('/cart/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid ID' });

    await cartCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Cart item removed' });
  });

  /* ================= START SERVER ================= */
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})();

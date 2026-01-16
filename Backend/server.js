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

(async () => {
  const db = await connectDB();
  const booksCollection = db.collection('books');
  const cartCollection = db.collection('cart');

  /* Root */
  app.get('/', (req, res) => {
    res.send('📚  Book Management API');
  });

  /* ================= BOOK ================= */

  // Create book
 app.post('/books', async (req, res) => {
  const data = req.body;

  // multiple books
  if (Array.isArray(data)) {
    const books = data.map(book => ({
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await booksCollection.insertMany(books);
    return res.status(201).json({
      message: 'Books inserted',
      count: result.insertedCount,
    });
  }

  // single book
  const book = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await booksCollection.insertOne(book);
  res.status(201).json({ message: 'Book created', id: result.insertedId });
});


  // Get all books
  app.get('/books', async (req, res) => {
    const books = await booksCollection.find().toArray();
    res.json(books);
  });

  // Get single book
  app.get('/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const book = await booksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  });

  // Update book
  app.put('/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    res.json({ message: 'Book updated' });
  });

  // Delete book
  app.delete('/books/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

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

    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const cartItem = cartSchema(bookId, quantity);
    await cartCollection.insertOne(cartItem);

    res.status(201).json({ message: 'Added to cart' });
  });

  // Remove cart item
  app.delete('/cart/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await cartCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Cart item removed' });
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})();

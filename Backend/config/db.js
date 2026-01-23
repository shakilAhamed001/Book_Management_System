// MongoDB connection এর জন্য প্রয়োজনীয় modules import করা
const { MongoClient, ServerApiVersion } = require('mongodb');

// Environment variable থেকে MongoDB connection string নিয়ে আসা
const uri = process.env.MONGODB_URL;

// MongoDB URL না থাকলে error দিয়ে process বন্ধ করা
if (!uri) {
  console.error('❌ MONGODB_URL missing');
  process.exit(1); // Application terminate করা
}

// MongoDB client তৈরি করা configuration সহ
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1, // MongoDB server API version
    strict: true, // Strict mode enable করা
    deprecationErrors: true, // Deprecated features এর জন্য error show করা
  },
});

// Database connection variable (singleton pattern)
let db;

// Database connection function
const connectDB = async () => {
  // Already connected থাকলে existing connection return করা
  if (db) return db;

  try {
    // MongoDB এর সাথে connection establish করা
    await client.connect();
    console.log('✅ MongoDB Connected');
    // Specific database select করা
    db = client.db('Book-management-system');
    return db;
  } catch (err) {
    // Connection error হলে log করে application terminate করা
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  }
};

// Function export করা যাতে অন্য files এ use করা যায়
module.exports = connectDB;

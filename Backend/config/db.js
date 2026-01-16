const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URL;

if (!uri) {
  console.error('❌ MONGODB_URL missing');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectDB = async () => {
  if (db) return db;

  try {
    await client.connect();
    console.log('✅ MongoDB Connected');
    db = client.db('Book-management-system');
    return db;
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const bookSchema = (data) => ({
  title: data.title,
  author: data.author,
  publishedYear: data.publishedYear || null,
  genre: data.genre || null,
  price: data.price,
  description: data.description || null,
  imageUrl: data.imageUrl || null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

module.exports = bookSchema;

// Book data structure define করার জন্য schema function
// এই function দিয়ে consistent book object তৈরি করা হয়
const bookSchema = (data) => ({
  title: data.title,                    // বইয়ের নাম (অবশ্যক)
  author: data.author,                  // লেখকের নাম (অবশ্যক)
  publishedYear: data.publishedYear || null,  // প্রকাশের বছর (ঐচ্ছিক)
  genre: data.genre || null,            // বইয়ের ধরন (ঐচ্ছিক) - Fiction, Non-fiction etc.
  price: data.price,                    // বইয়ের দাম (অবশ্যক)
  description: data.description || null, // বইয়ের বর্ণনা (ঐচ্ছিক)
  imageUrl: data.imageUrl || null,      // বইয়ের ছবির URL (ঐচ্ছিক)
  createdAt: new Date(),                // কখন তৈরি হলো (timestamp)
  updatedAt: new Date(),                // কখন শেষ update হলো (timestamp)
});

// Schema function export করা যাতে অন্য files এ use করা যায়
module.exports = bookSchema;

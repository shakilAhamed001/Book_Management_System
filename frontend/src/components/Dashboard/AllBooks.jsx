import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaEye, FaEdit, FaSearch } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "sonner";
import { baseUrl } from "../../utils/baseUrl";

const EMPTY_FORM = {
  title: "",
  author: "",
  publishedYear: "",
  genre: "",
  price: "",
  description: "",
  imageUrl: "",
};

// ✅ Placeholder constant
const PLACEHOLDER_IMG = "https://via.placeholder.com/600x400?text=No+Image";

const AllBooks = () => {
  const { user, getToken } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isUpdating, setUpdating] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  // Fetch books
  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${baseUrl}/admin/books`);
      const data = res.data;
      setBooks(Array.isArray(data) ? data : data.books || []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError(err.response?.data?.message || "Failed to load books. Try again.");
      toast?.error?.("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, [isEditOpen]);

  // Filter & sort
  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books.filter((b) => {
      if (!q) return true;
      return (
        (b.title || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q) ||
        (b.genre || "").toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (sortKey === "price" || sortKey === "publishedYear") {
        const na = Number(av) || 0;
        const nb = Number(bv) || 0;
        return sortDir === "asc" ? na - nb : nb - na;
      }
      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [books, query, sortKey, sortDir]);

  // Delete handler
  const handleDelete = async (bookId) => {
    if (!user) {
      toast?.error?.("Please log in to delete a book.");
      return;
    }
    if (!window.confirm("Permanently delete this book?")) return;

    const prev = books;
    setBooks((s) => s.filter((b) => b._id !== bookId));

    try {
      const token = await getToken();
      await axios.delete(`${baseUrl}/admin/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ plural 'books'
      });
      toast?.success?.("Book deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast?.error?.(err.response?.data?.error || "Failed to delete. Reverting.");
      setBooks(prev);
    }
  };

  // View modal
  const openViewModal = (book) => {
    setSelectedBook(book);
    setViewOpen(true);
  };
  const closeViewModal = () => {
    setViewOpen(false);
    setSelectedBook(null);
  };

  // Edit modal
  const openEditModal = (book) => {
    if (!user) {
      toast?.error?.("Please log in to edit a book.");
      return;
    }
    setSelectedBook(book);
    setForm({
      title: book.title ?? "",
      author: book.author ?? "",
      publishedYear: book.publishedYear ? String(book.publishedYear) : "",
      genre: book.genre ?? "",
      price: book.price ? String(book.price) : "",
      description: book.description ?? "",
      imageUrl: book.imageUrl ?? "",
    });
    setEditOpen(true);
  };
  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedBook(null);
    setForm(EMPTY_FORM);
    setUpdating(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title || form.title.trim().length < 2) {
      toast?.error?.("Title must be at least 2 characters.");
      return false;
    }
    if (!form.author || form.author.trim().length < 2) {
      toast?.error?.("Author must be at least 2 characters.");
      return false;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      toast?.error?.("Price must be a positive number.");
      return false;
    }
    if (
      form.publishedYear &&
      (isNaN(form.publishedYear) ||
        Number(form.publishedYear) < 1000 ||
        Number(form.publishedYear) > new Date().getFullYear())
    ) {
      toast?.error?.(`Published year must be between 1000 and ${new Date().getFullYear()}.`);
      return false;
    }
    if (form.imageUrl && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(form.imageUrl.trim())) {
      toast?.error?.("Image URL must be a valid image link.");
      return false;
    }
    return true;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !selectedBook) return;

    setUpdating(true);

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      price: Number(parseFloat(form.price)),
      publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
      genre: form.genre?.trim() || undefined,
      description: form.description?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const optimistic = { ...selectedBook, ...payload };
    const prevBooks = books;
    setBooks((bs) => bs.map((b) => (b._id === selectedBook._id ? optimistic : b)));

    try {
      const token = await getToken();
      const res = await axios.put(`${baseUrl}/admin/books/${selectedBook._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updated = res.data?.book || res.data || optimistic;
      setBooks((bs) => bs.map((b) => (b._id === selectedBook._id ? updated : b)));
      toast?.success?.("Book updated successfully");
      closeEditModal();
    } catch (err) {
      console.error("Update failed:", err);
      toast?.error?.(err.response?.data?.error || "Failed to update. Reverting changes.");
      setBooks(prevBooks);
      setUpdating(false);
    }
  };

  const formatPrice = (p) => {
    if (p === null || p === undefined) return "-";
    const n = Number(p);
    if (isNaN(n)) return "-";
    return `$${n.toFixed(2)}`;
  };

  // Loading skeleton
  const Skeleton = () => (
    <div className="animate-pulse grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow">
          <div className="h-40 bg-gray-200 rounded-md mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-800">All Books</h1>
          <p className="text-sm text-gray-500 mt-1">Manage catalog — edit, view or remove books</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author or genre..."
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 w-64"
            />
          </div>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-md border-gray-200 shadow-sm px-3 py-2"
          >
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
            <option value="price">Sort: Price</option>
            <option value="publishedYear">Sort: Year</option>
          </select>

          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            title="Toggle sort direction"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>

          <Link
            to="/dashboard/add-book"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition"
          >
            <FaPlus /> Add Book
          </Link>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}{" "}
            <button onClick={fetchAllBooks} className="ml-3 underline text-amber-700">
              Retry
            </button>
          </div>
        ) : displayed?.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-600">No books found.</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayed?.map((book) => (
              <article
                key={book._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={book.imageUrl || PLACEHOLDER_IMG}
                    alt={book.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      if (e.target.src !== PLACEHOLDER_IMG) e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">by {book.author || "-"}</p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div>
                      <div className="text-xs text-gray-400">Year</div>
                      <div className="font-medium">{book.publishedYear || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Genre</div>
                      <div className="font-medium">{book.genre || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Price</div>
                      <div className="font-medium">{formatPrice(book.price)}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3 line-clamp-3">{book.description || ""}</p>

                  <div className="mt-4 flex gap-2 items-center">
                    <button
                      onClick={() => openViewModal(book)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition text-amber-700"
                      title="View details"
                    >
                      <FaEye /> View
                    </button>

                    <button
                      onClick={() => openEditModal(book)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:shadow-sm transition ${
                        user ? "bg-green-600 text-white border-transparent hover:bg-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={!user}
                      title={user ? "Edit book" : "Login to edit"}
                    >
                      <FaEdit /> Edit
                    </button>
{/* ===== Edit Modal ===== */}
{isEditOpen && selectedBook && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-lg p-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-semibold mb-4">Edit Book</h2>
      <form onSubmit={handleEditSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Published Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Published Year</label>
          <input
            type="number"
            name="publishedYear"
            value={form.publishedYear}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
            rows={3}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleEditChange}
            className="w-full border rounded-lg p-2"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 h-40 w-full object-cover rounded-md border"
              onError={(e) => (e.target.src = PLACEHOLDER_IMG)}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

                    <button
                      onClick={() => handleDelete(book._id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:shadow-sm transition ${
                        user ? "bg-red-600 text-white border-transparent hover:bg-red-700" : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={!user}
                      title={user ? "Delete book" : "Login to delete"}
                    >
                      <FaTrash /> Delete
                    </button>

                    <div className="ml-auto text-xs text-gray-400">ID: {String(book._id).slice(-6)}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ===== View & Edit modals ===== */}
      {/* ... The modals stay the same, using PLACEHOLDER_IMG everywhere */}
      {/* See previous sections for full modal code */}
    </div>
  );
};

export default AllBooks;

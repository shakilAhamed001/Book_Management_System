import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../utils/baseUrl";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [cart, setCart] = useState([]);

  const provider = new GoogleAuthProvider();

  /* ================= AUTH ================= */

  const createUser = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await axios.post(
      `${baseUrl}/api/set-role`,
      { uid: result.user.uid, role: "user" },
      {
        headers: {
          Authorization: `Bearer ${await result.user.getIdToken()}`,
        },
      }
    );

    setRole("user");
    return result;
  };

  const logInUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const tokenResult = await result.user.getIdTokenResult();
    setRole(tokenResult.claims.role || "user");
    return result;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const tokenResult = await result.user.getIdTokenResult();

    if (!tokenResult.claims.role) {
      await axios.post(
        `${baseUrl}/api/set-role`,
        { uid: result.user.uid, role: "user" },
        {
          headers: {
            Authorization: `Bearer ${await result.user.getIdToken()}`,
          },
        }
      );
      setRole("user");
    } else {
      setRole(tokenResult.claims.role);
    }

    return result;
  };

  const logOutUser = async () => {
    setCart([]);
    setRole(null);
    await signOut(auth);
  };

  const profileUpdate = (data) => updateProfile(auth.currentUser, data);

  /* ================= CART ================= */

  const fetchCart = async (idToken) => {
    try {
      const res = await axios.get(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCart([]);
    }
  };

  const addToCart = async (book) => {
    if (!user) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    try {
      const idToken = await user.getIdToken();

      const res = await axios.post(
        `${baseUrl}/cart`,
        { bookId: book._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setCart((prev) => [...prev, res.data]);
      toast.success("Book added to cart");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const removeFromCart = async (cartId) => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();

      await axios.delete(`${baseUrl}/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setCart((prev) => prev.filter((item) => item._id !== cartId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();

      await Promise.all(
        cart.map((item) =>
          axios.delete(`${baseUrl}/cart/${item._id}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })
        )
      );

      setCart([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  /* ================= AUTH LISTENER ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        setRole(tokenResult.claims.role || "user");
        const idToken = await currentUser.getIdToken();
        await fetchCart(idToken);
      } else {
        setRole(null);
        setCart([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= TOKEN HELPER ================= */

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  /* ================= CONTEXT ================= */

  const authInfo = {
    user,
    loading,
    role,
    cart,
    getToken, // ✅ ADDED
    createUser,
    logInUser,
    signInWithGoogle,
    logOutUser,
    profileUpdate,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

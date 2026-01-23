// Firebase authentication functions import করা
import {
  createUserWithEmailAndPassword, // Email/password দিয়ে account তৈরি
  GoogleAuthProvider,              // Google login provider
  onAuthStateChanged,              // Auth state change listener
  signInWithEmailAndPassword,      // Email/password দিয়ে login
  signInWithPopup,                 // Popup দিয়ে login (Google)
  signOut,                         // Logout function
  updateProfile,                   // User profile update
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config"; // Firebase config
import axios from "axios"; // HTTP requests
import { toast } from "sonner"; // Toast notifications
import { baseUrl } from "../utils/baseUrl"; // API base URL

// Authentication context তৈরি করা - সব components এ auth state access করতে পারবে
export const AuthContext = createContext(null);

// Authentication provider component
const AuthProvider = ({ children }) => {
  // Authentication states
  const [user, setUser] = useState(null);      // Current logged in user
  const [loading, setLoading] = useState(true); // Loading state
  const [role, setRole] = useState(null);      // User role (admin/user)
  const [cart, setCart] = useState([]);        // Shopping cart items

  // Google authentication provider setup
  const provider = new GoogleAuthProvider();

  /* ================= AUTHENTICATION FUNCTIONS ================= */

  // নতুন user registration করার function
  const createUser = async (email, password) => {
    // Firebase এ email/password দিয়ে account তৈরি করা
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // নতুন user কে default "user" role assign করা
    await axios.post(
      `${baseUrl}/api/set-role`,
      { uid: result.user.uid, role: "user" }, // User ID এবং role
      {
        headers: {
          Authorization: `Bearer ${await result.user.getIdToken()}`, // JWT token
        },
      }
    );

    setRole("user"); // Local state এ role set করা
    return result;
  };

  // Existing user login করার function
  const logInUser = async (email, password) => {
    // Firebase এ email/password দিয়ে login করা
    const result = await signInWithEmailAndPassword(auth, email, password);
    // User এর token থেকে role extract করা
    const tokenResult = await result.user.getIdTokenResult();
    setRole(tokenResult.claims.role || "user"); // Role set করা
    return result;
  };

  // Google দিয়ে login করার function
  const signInWithGoogle = async () => {
    // Google popup দিয়ে login করা
    const result = await signInWithPopup(auth, provider);
    const tokenResult = await result.user.getIdTokenResult();

    // প্রথমবার Google login হলে role set করা
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
      // Existing user এর role set করা
      setRole(tokenResult.claims.role);
    }

    return result;
  };

  // User logout করার function
  const logOutUser = async () => {
    setCart([]);      // Cart clear করা
    setRole(null);    // Role clear করা
    await signOut(auth); // Firebase logout
  };

  // User profile update করার function
  const profileUpdate = (data) => updateProfile(auth.currentUser, data);

  /* ================= SHOPPING CART MANAGEMENT ================= */

  // User এর cart items fetch করার function
  const fetchCart = async (idToken) => {
    try {
      // Backend API থেকে cart items get করা
      const res = await axios.get(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${idToken}` }, // JWT token authentication
      });
      // Cart state update করা
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCart([]); // Error হলে empty cart set করা
    }
  };

  // Cart এ book add করার function
  const addToCart = async (book) => {
    // User logged in আছে কিনা check করা
    if (!user) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    try {
      // JWT token get করা
      const idToken = await user.getIdToken();

      // Backend API এ cart item add করা
      const res = await axios.post(
        `${baseUrl}/cart`,
        { bookId: book._id, quantity: 1 }, // Book ID এবং quantity
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Local cart state update করা
      setCart((prev) => [...prev, res.data]);
      toast.success("Book added to cart");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  // Cart থেকে item remove করার function
  const removeFromCart = async (cartId) => {
    if (!user) return; // User check

    try {
      const idToken = await user.getIdToken();

      // Backend API থেকে cart item delete করা
      await axios.delete(`${baseUrl}/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      // Local cart state update করা
      setCart((prev) => prev.filter((item) => item._id !== cartId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // পুরো cart clear করার function
  const clearCart = async () => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();

      // সব cart items একসাথে delete করা
      await Promise.all(
        cart.map((item) =>
          axios.delete(`${baseUrl}/cart/${item._id}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })
        )
      );

      setCart([]); // Local cart clear করা
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  /* ================= AUTHENTICATION STATE LISTENER ================= */

  // Firebase auth state change monitor করার useEffect
  useEffect(() => {
    // Auth state change listener setup করা
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); // Current user set করা

      if (currentUser) {
        // User logged in থাকলে role এবং cart fetch করা
        const tokenResult = await currentUser.getIdTokenResult();
        setRole(tokenResult.claims.role || "user"); // Role set করা
        const idToken = await currentUser.getIdToken();
        await fetchCart(idToken); // Cart items fetch করা
      } else {
        // User logged out হলে states clear করা
        setRole(null);
        setCart([]);
      }

      setLoading(false); // Loading state end করা
    });

    // Component unmount হলে listener cleanup করা
    return () => unsubscribe();
  }, []); // Empty dependency - শুধু component mount এ run হবে

  /* ================= HELPER FUNCTIONS ================= */

  // JWT token get করার helper function
  const getToken = async () => {
    if (!user) return null; // User না থাকলে null return
    return await user.getIdToken(); // Firebase JWT token return করা
  };

  /* ================= CONTEXT VALUE ================= */

  // সব child components এ available হবে এই values গুলো
  const authInfo = {
    user,           // Current user object
    loading,        // Loading state
    role,           // User role (admin/user)
    cart,           // Shopping cart items
    getToken,       // JWT token getter function
    createUser,     // Registration function
    logInUser,      // Login function
    signInWithGoogle, // Google login function
    logOutUser,     // Logout function
    profileUpdate,  // Profile update function
    addToCart,      // Add to cart function
    removeFromCart, // Remove from cart function
    clearCart,      // Clear cart function
  };

  // Context provider return - সব child components এ authInfo access করতে পারবে
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

// AuthProvider component export করা
export default AuthProvider;

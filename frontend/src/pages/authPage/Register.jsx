// React hooks এবং routing এর জন্য প্রয়োজনীয় imports
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navigation এর জন্য
import { toast } from "react-toastify"; // Toast notifications
import { AuthContext } from "../../providers/AuthProvider"; // Authentication context

// User registration করার component
const Register = () => {
  // Authentication context থেকে registration functions নিয়ে আসা
  const { setUser, createUser, profileUpdate, setRole } = useContext(AuthContext);
  const navigate = useNavigate(); // Page navigation এর জন্য

  // User registration handle করার main function
  const handleRegister = async (e) => {
    e.preventDefault(); // Default form submit prevent করা

    // Form থেকে name, email, password নিয়ে আসা
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // Password validation regex - uppercase, lowercase, minimum 6 characters
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    // Password strength check করা
    if (!regex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase letters, and be at least 6 characters long.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: "bounce",
        }
      );
      return; // Password weak হলে registration stop করা
    }

    try {
      // Firebase এ user account তৈরি করা
      const result = await createUser(email, password);
      
      // User profile update করা (display name set করা)
      await profileUpdate({ displayName: name });
      
      // Local states update করা
      setUser(result.user); // User state set করা
      setRole('user'); // Default role set করা
      
      // Home page এ redirect করা
      navigate("/");
      
      // Success toast notification
      toast.success("Registration Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: "bounce",
      });
    } catch (error) {
      // Registration error handle করা
      console.error("Registration error:", error.code, error.message);
      
      // Error toast notification
      toast.error(`Registration failed: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: "bounce",
      });
    }
  };

  return (
    <div className="flex justify-center pb-20">
      {/* Registration form container */}
      <div className="card bg-base-100 top-10 w-11/12 md:w-[850px] shrink-0 border-4 border-black rounded-none p-5 md:p-20 pb-10 mb-10">
        {/* Registration form title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-black text-center">
          Register your account
        </h1>
        <div className="divider my-7 md:my-14"></div>
        
        {/* Registration form */}
        <form onSubmit={handleRegister} className="card-body pt-0">
          {/* Name input field */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl md:text-2xl font-semibold">
                Name
              </span>
            </label>
            <input
              type="text"
              placeholder="your name"
              name="name"
              className="input input-bordered rounded-none w-full"
              required
            />
          </div>
          
          {/* Email input field */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl md:text-2xl font-semibold">
                Email address
              </span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="input input-bordered rounded-none w-full"
              required
            />
          </div>
          
          {/* Password input field */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl md:text-2xl font-semibold">
                Password
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered rounded-none w-full"
              required
            />
            {/* Forgot password link (placeholder) */}
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          
          {/* Registration submit button */}
          <div className="fieldset">
            <button className="btn text-white text-xl bg-black rounded-none border-none">
              Register
            </button>
          </div>
        </form>
        
        {/* Login page link */}
        <Link
          to="/auth/login"
          className="font-semibold text-[#706F6F] text-center"
        >
          Already Have An Account? <span className="text-red-500">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
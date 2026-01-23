// React hooks এবং routing এর জন্য প্রয়োজনীয় imports
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../providers/AuthProvider"; // Authentication context
import { Bounce, toast } from "react-toastify"; // Toast notifications
import { FaGoogle } from "react-icons/fa"; // Google icon

// User login করার component
const Login = () => {
  // Authentication context থেকে login functions নিয়ে আসা
  const { setUser, logInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation(); // Current location (redirect এর জন্য)
  const navigate = useNavigate(); // Page navigation এর জন্য

  // Email/Password দিয়ে login handle করার function
  const handleLogin = (e) => {
    e.preventDefault(); // Default form submit prevent করা

    // Form থেকে email এবং password নিয়ে আসা
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // AuthProvider থেকে logInUser function call করা
    logInUser(email, password)
      .then((result) => {
        // Login successful হলে
        setUser(result.user); // User state set করা
        
        // Previous page এ redirect করা, না থাকলে home page এ
        navigate(location?.state ? location.state : "/");
        
        // Success toast notification show করা
        const notify = () =>
          toast.success("Login Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        notify();
      })
      .catch((error) => {
        // Login error হলে
        console.log(error.code);
        
        // Error toast notification show করা
        const notify = () =>
          toast.error(error.code, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        notify();
      });
  };

  // Google দিয়ে login handle করার function
  const handleLogInGoogle = () => {
    // AuthProvider থেকে Google login function call করা
    signInWithGoogle()
      .then((result) => {
        // Google login successful হলে
        console.log(result.user);
        setUser(result.user); // User state set করা
        
        // Success toast notification
        const notify = () =>
          toast.success("Login Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        
        // Previous page এ redirect করা
        navigate(location?.state ? location.state : "/");
        notify();
      })
      .catch((error) => {
        // Google login error handle করা
        console.log(error);
      });
  };

  return (
    <div className="flex justify-center">
      {/* <Helmet>
          <title>CareerAlly Login</title>
        </Helmet> */}
      <div className="card bg-base-100 top-10 w-11/12 md:w-[752px] md:h-[700px] shrink-0 border-4 border-black rounded-none p-10 md:p-20 mb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl  font-bold text-black text-center">
          Login your account
        </h1>
        <div className="divider my-7 md:my-14"></div>
        <form onSubmit={handleLogin} className="card-body pt-0">
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl md:text-2xl font-semibold">
                Email address
              </span>
            </label>
            <input
              type="email"
              placeholder="email"
              name="email"
              className="input input-bordered rounded-none w-full"
              required
            />
          </div>
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl md:text-2xl font-semibold">
                Password
              </span>
            </label>
            {/* <button type="button" className="flex justify-end w-[95%]">
                {showPassword ? (
                  <FaEye className=" absolute top-[290px] md:top-[395px]" />
                ) : (
                  <FaEyeSlash className=" absolute top-[290px] md:top-[395px]" />
                )}
              </button> */}
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered rounded-none w-full"
              required
            />
            <label className="label">
              <Link
                to={"/auth/forget-password"}
                href="#"
                className="label-text-alt link link-hover"
              >
                Forgot password?
              </Link>
            </label>
          </div>
          <div className="fieldset">
            <button className="btn rounded-none text-white text-xl bg-black  border-none">
              Login
            </button>
          </div>
          <div className="fieldset">
            <button
              type="button"
              onClick={handleLogInGoogle}
              className="btn text-white rounded-none text-xl  bg-black   border-none"
            >
              <FaGoogle />
              Login with Google
            </button>
          </div>
        </form>
        <Link
          to={"/auth/register"}
          className="font-semibold text-[#706F6F] text-center"
        >
          Don’t Have An Account ? <span className="text-red-500">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;

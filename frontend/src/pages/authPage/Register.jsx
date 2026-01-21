import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Updated import
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";

const Register = () => {
  const { setUser, createUser, profileUpdate, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

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
      return;
    }

    try {
      const result = await createUser(email, password);
      await profileUpdate({ displayName: name });
      setUser(result.user);
      setRole('user'); // Set default role
      navigate("/");
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
      console.error("Registration error:", error.code, error.message);
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
      <div className="card bg-base-100 top-10 w-11/12 md:w-[850px] shrink-0 border-4 border-black rounded-none p-5 md:p-20 pb-10 mb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-black text-center">
          Register your account
        </h1>
        <div className="divider my-7 md:my-14"></div>
        <form onSubmit={handleRegister} className="card-body pt-0">
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
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          <div className="fieldset">
            <button className="btn text-white text-xl bg-black rounded-none border-none">
              Register
            </button>
          </div>
        </form>
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
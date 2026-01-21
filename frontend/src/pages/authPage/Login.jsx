import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../providers/AuthProvider";
import { Bounce, toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const { setUser, logInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  // console.log(location);

  const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // console.log(email, password);

    logInUser(email, password)
      .then((result) => {
        setUser(result.user);
        navigate(location?.state ? location.state : "/");
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
        console.log(error.code);
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

  const handleLogInGoogle = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result.user);
        setUser(result.user);
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
        navigate(location?.state ? location.state : "/");
        notify();
      })
      .catch((error) => console.log(error));
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

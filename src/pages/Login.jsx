import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/Slices/loginSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import google from "../assets/google-icon.png";
import facebook from "../assets/facebook-icon.png";
import apple from "../assets/apple-icon.png";
import TextInput from "../components/TextInput/TextInput";
import { useForm } from "react-hook-form";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => toast.error(err || "Login failed"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg m-4 sm:m-8 md:m-12 lg:m-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}

          <TextInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email address"
            registerName="email"
            props={{ ...register('email', { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" } }) }}
            errors={errors.email}
          />

          {/* Password Field */}
          <TextInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            registerName="password"
            props={{ ...register('password', { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }) }}
            errors={errors.password}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Remember me</span>
            </label>
            <Link to="/forget-password" className="text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-orange w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign Up

          </Link>
        </p>

        {/* Social Login */}
        <div className="border-t my-4" style={{ borderColor: "rgba(39, 43, 53, 0.1)" }}></div>
        <div className="mt-6">
          <p className="text-center text-gray-400 text-sm mb-3">Or Continue With</p>
          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition">
              <img src={google} alt="Google" className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#0866ff] shadow hover:shadow-md flex items-center justify-center transition">
              <img src={facebook} alt="Facebook" className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-black shadow hover:shadow-md flex items-center justify-center transition">
              <img src={apple} alt="Apple" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

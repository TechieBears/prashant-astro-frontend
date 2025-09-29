import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../redux/Slices/loginSlice";
import { fetchCartData } from "../redux/Slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import google from "../assets/google-icon.png";
import facebook from "../assets/facebook-icon.png";
import apple from "../assets/apple-icon.png";
import TextInput from "../components/TextInput/TextInput";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = (data) => {
        const { title, firstName, lastName, email, password, mobileNo } = data;

        dispatch(registerUser({
            title,
            firstName,
            lastName,
            email,
            password,
            phone: mobileNo,
            registerType: "normal"
        }))
            .unwrap()
            .then(() => {
                dispatch(loginUser({ email, password }))
                    .unwrap()
                    .then((res) => {
                        if (res.success) {
                            // Fetch user's cart data after successful login
                            dispatch(fetchCartData());
                            toast.success(res.message);
                            navigate("/");
                        } else {
                            toast.error(res.message || "Something went wrong");
                        }
                    })
                    .catch((err) => toast.error(err || "Login after Registration failed"));
            })
            .catch((err) => toast.error(err || "Registration failed"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg m-4 sm:m-8 md:m-12 lg:m-16 sm:mt-6 mt-20">
                <h2 className="text-2xl font-bold text-center mb-2 text-primary">Register</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Create a new account</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                        <div className="flex gap-2 flex-wrap">
                            {["Mr", "Mrs", "Miss", "Baby", "Master"].map((opt) => (
                                <label
                                    key={opt}
                                    className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-150 ${watch("title") === opt
                                        ? "border-primary text-primary font-medium"
                                        : "bg-white text-black"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={opt}
                                        {...register("title", { required: "Title is required" })}
                                        className="hidden"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Name, Email, Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="First Name"
                            type="text"
                            placeholder="Enter first name"
                            name="firstName"
                            errors={errors.firstName}
                            registerName="firstName"
                            props={{ ...register('firstName', { required: "First name is required" }) }}
                        />
                        <TextInput
                            label="Last Name"
                            type="text"
                            placeholder="Enter last name"
                            name="lastName"
                            registerName="lastName"
                            errors={errors.lastName}
                            props={{ ...register('lastName', { required: "Last name is required" }) }}
                        />
                        <TextInput
                            label="Email"
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            errors={errors.email}
                            registerName="email"
                            props={{ ...register('email', { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" } }) }}
                        />
                        <TextInput
                            label="Phone Number"
                            type="tel"
                            placeholder="Enter phone number"
                            name="mobileNo"
                            errors={errors.mobileNo}
                            registerName="mobileNo"
                            props={{ ...register('mobileNo', { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" } }) }}
                        />
                        <TextInput
                            label="Create Password"
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            errors={errors.password}
                            registerName="password"
                            props={{ ...register('password', { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }) }}
                        />
                        <TextInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            errors={errors.confirmPassword}
                            registerName="confirmPassword"
                            props={{ ...register('confirmPassword', { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" }) }}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-gradient-orange px-10 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition mx-auto block"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>

                {/* Social Logins */}
                <div className="border-t my-4" style={{ borderColor: "rgba(39, 43, 53, 0.1)" }}></div>
                <div className="mt-6">
                    <p className="text-center text-gray-400 text-sm mb-3">Or Continue With</p>
                    <div className="flex justify-center space-x-4">
                        <button className="w-12 h-12 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition">
                            <img src={google} alt="Google" className="w-6 h-6" />
                        </button>
                        {/* <button className="w-12 h-12 rounded-full bg-[#0866ff] shadow hover:shadow-md flex items-center justify-center transition">
                            <img src={facebook} alt="Facebook" className="w-6 h-6" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-black shadow hover:shadow-md flex items-center justify-center transition">
                            <img src={apple} alt="Apple" className="w-6 h-6" />
                        </button> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Register;


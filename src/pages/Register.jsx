import { useState } from "react";
import google from "../assets/google-icon.png";
import facebook from "../assets/facebook-icon.png";
import apple from "../assets/apple-icon.png";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../redux/Slices/loginSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setMessage("");
        dispatch(registerUser({ title, firstName, lastName, email, password, mobileNo }))
            .unwrap()
            .then(() => {
                dispatch(loginUser({ email, password }))
                    .unwrap()
                    .then((res) => {
                        if (res.success) {
                            toast.success(res.message);
                            navigate("/");
                        } else {
                            toast.error(res.message || "Something went wrong");
                        }
                    })
                    .catch(err => toast.error(err || "Login after Registration failed"));
            })
            .catch(err => alert(err || "Registration failed"));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl m-6">
                <h2 className="text-2xl font-bold text-center mb-2 text-primary">
                    Register
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Create a new account
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label>Title <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                {["Mr", "Mrs", "Miss", "Baby", "Master"].map((opt, idx) => (
                                    <label
                                        key={idx}
                                        className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-150 ${title === opt
                                            ? "border-primary text-primary font-medium"
                                            : "bg-white text-black"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={opt}
                                            checked={title === opt}
                                            onChange={() => setTitle(opt)}
                                            className="hidden"
                                            required
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name *</label>
                            <input
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name *</label>
                            <input
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Create Password *</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>
                    {message && (
                        <p className={`text-center mt-3 text-sm ${message === "Passwords do not match" ? "text-red-500" : "text-green-500"}`}>
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="bg-gradient-orange px-10 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition mx-auto block"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary hover:underline">Login</a>
                </p>
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
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default Register;

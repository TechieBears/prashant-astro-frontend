import { useState } from "react";
import google from "../assets/google-icon.png";
import facebook from "../assets/facebook-icon.png";
import apple from "../assets/apple-icon.png";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl m-6">
                <h2 className="text-2xl font-bold text-center mb-2 text-primary">
                    Register
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Create a new account
                </p>

                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender *</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <button
                        type="submit"
                        className="bg-gradient-orange px-10 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition mx-auto block"
                    >
                        Register
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-3 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}

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
        </div>
    );
};

export default Register;

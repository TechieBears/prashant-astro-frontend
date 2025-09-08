import { useState } from "react";
import axios from "axios";
import google from "../assets/google-icon.png";
import facebook from "../assets/facebook-icon.png";
import apple from "../assets/apple-icon.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg m-16">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                    Login
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password *</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg border border-gray-200 bg-[#F1F5F9] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-orange w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don’t have an account? <a href="/register" className="text-primary hover:underline">Sign Up</a>
                </p>
                {/* Separator */}
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
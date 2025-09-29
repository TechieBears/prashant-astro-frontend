import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetUserPassword } from "../redux/Slices/loginSlice";
import toast, { Toaster } from "react-hot-toast";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            dispatch(resetUserPassword({ token, password }))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        toast.success(res.message);
                        navigate("/login");
                    } else {
                        toast.error(res.message || "Something went wrong");
                    }
                })
                .catch((err) => {
                    toast.error(err || "Password reset failed");
                });
        } catch (err) {
            console.error("Logout Failed:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md m-6">
                <h2 className="text-2xl font-bold text-center mb-2">
                    <span className="text-2xl font-bold text-center mb-6 text-primary">Reset Password!</span>
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Enter your new password to reset your account
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
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
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-gradient-orange w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
                    >
                        Reset your Password
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <a href="/login" className="text-primary hover:underline text-sm flex items-center justify-center">
                        ← Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
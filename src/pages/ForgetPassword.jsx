import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgetUserPassword } from "../redux/Slices/loginSlice";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleForgetUserPassword = (e) => {
        e.preventDefault();
        setLoading(true);

        dispatch(forgetUserPassword({ email }))
            .unwrap()
            .then((res) => {
                if (res.success) {
                    toast.success(res.message || "Password reset email sent!");
                } else {
                    toast.error(res.message || "Something went wrong");
                }
            })
            .catch((err) => {
                toast.error(err || "Forget password failed");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="m-10 flex items-center justify-center bg-yellow-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2">
                    <span className="text-2xl font-bold text-center mb-6 text-primary ">Forgot Password?</span>
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    No worries, we’ll send you reset instructions.
                </p>

                <form onSubmit={handleForgetUserPassword} className="space-y-4">
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
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-orange hover:opacity-90"
                            }`}
                    >
                        {loading ? "Please wait..." : "Continue"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-primary hover:underline text-sm flex items-center justify-center">
                        ← Back to Login
                    </a>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default ForgotPassword;

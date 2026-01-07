import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput/TextInput";
import { forgetUserPassword } from "../api";
import axios from "axios";
import { environment } from "../env";

const ForgotPassword = () => {
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [email, setEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: errorsReset, isSubmitting: isSubmittingReset },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await forgetUserPassword({ email: data.email });

            if (response.success) {
                setEmail(data.email);
                setShowOtpForm(true);
                toast.success(response.message || "OTP sent to your email!");
            } else {
                toast.error(response.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message || "Forget password failed");
        }
    };

    const onResetSubmit = async (data) => {
        try {
            const response = await axios.post(
                `${environment.baseUrl}customer-users/verify-reset-password`,
                {
                    otp: parseInt(data.otp),
                    newPassword: data.newPassword
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Password reset successfully!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            } else {
                toast.error(response.data.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="flex items-start pt-12 pb-4 justify-center bg-yellow-50 min-h-[calc(60vh-2rem)] px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-16 md:mt-6">
                {!showOtpForm ? (
                    <>
                        <h2 className="text-xl font-bold text-center mb-1 text-primary">
                            Forgot Password?
                        </h2>
                        <p className="text-center text-gray-500 mb-4 text-sm">
                            No worries, we'll send you reset instructions.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <TextInput
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                errors={errors.email}
                                registerName="email"
                                props={{ ...register('email', { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" } }) }}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg text-white font-semibold transition ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-orange hover:opacity-90"
                                    }`}
                            >
                                {isSubmitting ? "Please wait..." : "Continue"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <Link to="/login" className="text-primary hover:underline text-sm flex items-center justify-center">
                                ← Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-center mb-1 text-primary">
                            Reset Password
                        </h2>
                        <p className="text-center text-gray-500 mb-4 text-sm">
                            Enter the OTP sent to {email} and your new password.
                        </p>

                        <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-4">
                            <TextInput
                                label="OTP"
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                errors={errorsReset.otp}
                                registerName="otp"
                                props={{ ...registerReset('otp', { required: "OTP is required" }) }}
                            />

                            <TextInput
                                label="New Password"
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                errors={errorsReset.newPassword}
                                registerName="newPassword"
                                props={{ ...registerReset('newPassword', { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }) }}
                            />

                            <button
                                type="submit"
                                disabled={isSubmittingReset}
                                className={`w-full py-3 rounded-lg text-white font-semibold transition ${isSubmittingReset
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-orange hover:opacity-90"
                                    }`}
                            >
                                {isSubmittingReset ? "Please wait..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setShowOtpForm(false)}
                                className="text-primary hover:underline text-sm"
                            >
                                ← Back to Email
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

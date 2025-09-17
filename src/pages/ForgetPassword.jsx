import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { forgetUserPassword } from "../redux/Slices/loginSlice";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput/TextInput";

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = (data) => {
        dispatch(forgetUserPassword({ email: data.email }))
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
            });
    };

    return (
        <div className="m-10 flex items-center justify-center bg-yellow-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2 text-primary">
                    Forgot Password?
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    No worries, we’ll send you reset instructions.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
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
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            isSubmitting
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
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default ForgotPassword;

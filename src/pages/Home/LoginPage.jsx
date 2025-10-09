import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import TextInput from "../../components/TextInput/TextInput";
import { FcGoogle } from "react-icons/fc";
import ForgetPasswordModal from "../../components/Modals/ForgetPassword/ForgetPasswordModal";
import { loginUser, registerUser } from "../../api";
import { setLoggedUser, setRoleIs, setUserDetails } from "../../redux/Slices/loginSlice";
import { validateEmail, validatePassword } from "../../utils/validateFunction";
import { useForm } from "react-hook-form";
import LoadBox from "../../components/Loader/LoadBox";
import { formBtn3 } from "../../utils/CustomClass";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedCredentials = localStorage.getItem('rememberedCredentials');
        if (savedCredentials) {
            const { email, password, rememberMe: savedRememberMe } = JSON.parse(savedCredentials);
            if (savedRememberMe) {
                setValue('email', email);
                setValue('password', password);
                setRememberMe(true);
            }
        }
    }, [setValue]);

    const saveCredentials = (email, password, remember) => {
        if (remember) {
            const credentials = {
                email,
                password,
                rememberMe: true
            };
            localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
        } else {
            localStorage.removeItem('rememberedCredentials');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const playload = {
            ...data,
            fcmToken: localStorage.getItem('token')
        }
        try {
            const response = await loginUser(playload);
            if (response?.success) {
                saveCredentials(data.email, data.password, rememberMe);
                dispatch(setUserDetails(response?.data?.user))
                setLoading(false)
                dispatch(setLoggedUser(true))
                dispatch(setRoleIs(response?.data?.user?.role))
                if (!rememberMe) {
                    reset()
                    setRememberMe(false);
                }
                localStorage.setItem('token', response?.data?.token);
                toast.success("Login Successfully 🥳");

                // Redirect to the intended destination or home page
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
            } else {
                toast.error(response?.message || response?.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'ERR_NETWORK') {
                toast.error('Network error. Please check your connection or try again later.');
            } else {
                toast.error(error || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        gsap.from(".card", {
            y: 30,
            opacity: 0,
            ease: "power1.inOut",
            duration: 1
        })
    }, [])

    const handerGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            setLoading(true);
            const playload = {
                firstName: result?.user?.displayName?.split(' ')[0] || '',
                lastName: result?.user?.displayName?.split(' ')[1] || '',
                email: result?.user?.email || '',
                mobileNo: result?.user?.providerData[0]?.mobileNo || '',
                profileImage: result?.user?.photoURL || '',
                gender: result?.user?.providerData[0]?.gender || 'other' || '',
                registerType: 'google'
            }
            try {
                const response = await registerUser(playload);
                if (response?.success) {
                    dispatch(setUserDetails(response?.data?.user))
                    setLoading(false)
                    dispatch(setLoggedUser(true))
                    dispatch(setRoleIs(response?.data?.user?.role))
                    localStorage.setItem('token', response?.data?.token);
                    toast.success("Login Successfully 🥳");

                    // Redirect to the intended destination or home page
                    const from = location.state?.from || '/';
                    navigate(from, { replace: true });
                } else {
                    toast.error(response?.message || response?.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                if (error.code === 'ERR_NETWORK') {
                    toast.error('Network error. Please check your connection or try again later.');
                } else {
                    toast.error(error || 'Something went wrong. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="min-h-screen mt-12 flex items-center justify-center bg-[#FFF9EF] px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 card">
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-p">
                    Login
                </h2>

                {/* Form */}
                <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email *
                        </label>
                        <TextInput
                            label="Enter email*"
                            placeholder="Enter email"
                            type="email"
                            registerName="email"
                            props={{ ...register('email', { required: "Email is required", validate: validateEmail }), minLength: 3 }}
                            errors={errors.email}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Password *
                        </label>
                        <TextInput
                            label="Enter Your Password"
                            placeholder="Enter Your Password"
                            type="password"
                            registerName="password"
                            props={{ ...register('password', { validate: validatePassword, required: "Password is required" }), minLength: 6, }}
                            errors={errors.password}
                        />
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForgetPasswordModal(true)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    {loading ? <LoadBox className={formBtn3} /> : <button
                        type="submit"
                        className={`${formBtn3} !rounded`}
                    >
                        Login
                    </button>}

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <NavLink
                            to="/register"
                            className="font-medium text-pink-600 hover:text-pink-500 underline"
                        >
                            Sign Up
                        </NavLink>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-400 text-sm">Or Continue With</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            className="p-3 px-5 w-full h-[51px] flex justify-center items-center rounded-full shadow-md bg-white hover:bg-gray-100 border border-slate-100 gap-2"
                            onClick={handerGoogleSignIn}
                        >

                            <FcGoogle size={22} />
                            <span className="text-sm font-tbLex font-normal">Continue with Google</span>
                        </button>

                        {/* <button
              type="button"
              onClick={() => setShowResetPasswordModal(true)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              ResetPass
            </button> */}
                    </div>
                </form>
            </div>

            {/* Forget Password Modal */}
            <ForgetPasswordModal
                open={showForgetPasswordModal}
                setOpen={setShowForgetPasswordModal}
            />
            {/* Forget Password Modal */}
            {/* <ResetPasswordModal
        open={showResetPasswordModal}
        setOpen={setShowResetPasswordModal}
      /> */}
        </div>
    );
};

export default LoginPage;

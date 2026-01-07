import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import TextInput from "../components/TextInput/TextInput";
import SelectTextInput from "../components/TextInput/SelectTextInput";
import LoadBox from "../components/Loader/LoadBox";
import { registerUser } from "../api";
import { loginSuccess, registerSuccess, setIsRegistered } from "../redux/Slices/loginSlice";
import {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
} from "../utils/validateFunction";
import { formBtn3 } from "../utils/CustomClass";
import { useCart } from "../hooks/useCart";

const Register = () => {
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset,
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { fetchCartData } = useCart();



    const onSubmit = async (data) => {
        const playload = {
            ...data,
            registerType: "normal",
        };
        try {
            setLoader(true);
            console.log('🚀 Before register API call - isRegistered: false');
            const response = await registerUser(playload);

            if (
                response?.message === "User created successfully" ||
                response?.success
            ) {

                console.log('🔍 Registration Response:', response);
                console.log('🔍 User Data Being Stored in Redux:', response.data.user);
                console.log('🔍 Gender in Response:', response.data.user?.gender);
                dispatch(registerSuccess(response));
                dispatch(loginSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    role: response.data.user.role
                }));
                dispatch(setIsRegistered(true));
                try {
                    await fetchCartData();
                } catch (error) {
                    console.error('Failed to fetch cart data:', error);
                }
                setLoader(false);
                toast.success("Registration and login successful!");
                navigate("/", { replace: true });
            } else {
                setLoader(false);
                toast.error(response?.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setLoader(false);
            toast.error(error?.message || "Something went wrong");
        }
    };

    useGSAP(() => {
        gsap.from(".card", {
            y: 30,
            opacity: 0,
            ease: "power1.inOut",
            duration: 1,
        });
    }, []);

    return (
        <div className="h-full bg-[#FFF9EF] py-24 flex items-center justify-center  px-4">
            <div className="card w-full max-w-2xl bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-p">
                        Register
                    </h2>
                </div>

                {/* Form */}
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Title */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-sm font-tbLex font-normal text-black-400 pb-2.5">
                            Title *
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {["Mr", "Mrs", "Miss", "Baby", "Master"].map((type) => (
                                <Controller
                                    key={type}
                                    name="title"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <button
                                            type="button"
                                            onClick={() => onChange(type)}
                                            className={`flex-1 min-w-[70px] sm:min-w-[80px] px-3 sm:px-4 md:px-5 font-tbLex py-2 sm:py-2.5 md:py-3 rounded-md text-xs sm:text-sm font-medium ${value === type
                                                ? "bg-gradient-orange text-white"
                                                : "bg-slate-100 text-slate-700 hover:bg-button-gradient-orange hover:text-white"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            First Name *
                        </label>
                        <TextInput
                            label="First Name"
                            type="text"
                            placeholder="Enter first name"
                            name="firstName"
                            errors={errors.firstName}
                            registerName="firstName"
                            props={{
                                ...register('firstName', {
                                    required: "First name is required",
                                    pattern: {
                                        value: /^[A-Za-z\s\-']+$/,
                                        message: "Please enter a valid first name (letters only)"
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "First name must be at least 2 characters"
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "First name cannot exceed 30 characters"
                                    }
                                })
                            }}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="col-span-1">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Last Name *
                        </label>
                        <TextInput
                            label="Last Name"
                            type="text"
                            placeholder="Enter last name"
                            name="lastName"
                            registerName="lastName"
                            errors={errors.lastName}
                            props={{
                                ...register('lastName', {
                                    required: "Last name is required",
                                    pattern: {
                                        value: /^[A-Za-z\s\-']+$/,
                                        message: "Please enter a valid last name (letters only)"
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "Last name must be at least 2 characters"
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "Last name cannot exceed 30 characters"
                                    }
                                })
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div className="col-span-1 md:col-span-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Email *
                        </label>
                        <TextInput
                            label="Enter Your Email"
                            placeholder="Enter Your Email"
                            type="text"
                            registerName="email"
                            props={{
                                ...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Invalid email address",
                                    },
                                }),
                            }}
                            errors={errors.email}
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-span-1">
                        <label
                            htmlFor="mobileNo"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Phone Number *
                        </label>
                        <TextInput
                            label="Enter Your Phone Number"
                            placeholder="Enter Your Phone Number"
                            type="tel"
                            registerName="mobileNo"
                            props={{
                                ...register("mobileNo", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Enter a valid 10-digit number",
                                    },
                                }),
                                maxLength: 10,
                                minLength: 10,
                            }}
                            errors={errors.mobileNo}
                        />
                    </div>

                    {/* Gender */}
                    <div className="col-span-1">
                        <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Gender *
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            defaultValue=""
                            className={`h-[55px] w-full outline-none px-4 text-base font-tbLex text-black rounded-md bg-slate-100 border-[1.5px] ${errors.gender ? 'border-red-500' : 'border-transparent'}`}
                            {...register("gender", { required: "Gender is required" })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="col-span-1">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Password *
                        </label>
                        <TextInput
                            label="Enter Your Password"
                            placeholder="Enter Your Password"
                            type="password"
                            registerName="password"
                            props={{
                                ...register("password", {
                                    validate: validatePassword,
                                    required: "Password is required",
                                }),
                                minLength: 6,
                            }}
                            errors={errors.password}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="col-span-1">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Confirm Password *
                        </label>
                        <TextInput
                            label="Enter Your Confirm Password"
                            placeholder="Enter Your Confirm Password"
                            type="password"
                            registerName="confirmPassword"
                            props={{
                                ...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") || "Passwords do not match",
                                }),
                                minLength: 6,
                            }}
                            errors={errors.confirmPassword}
                        />
                    </div>

                    {/* Button */}
                    <div className="col-span-1 md:col-span-2 mt-2">
                        {loader ? <LoadBox className={`${formBtn3} !rounded bg-gradient-orange text-white w-full`} /> : <button
                            type="submit"
                            className={`${formBtn3} !rounded bg-gradient-orange text-white w-full`}
                        >
                            Register
                        </button>}
                    </div>
                </form>

                {/* Already have account */}
                <div className="mt-6 text-center">
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <NavLink
                            to="/login"
                            className="font-medium bg-gradient-orange bg-clip-text text-transparent hover:opacity-80 underline"
                        >
                            Login
                        </NavLink>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Register;

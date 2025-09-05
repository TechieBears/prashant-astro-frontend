import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1 } from '../../utils/CustomClass';
import TextInput from '../../components/TextInput/TextInput';
import LoadBox from '../../components/Loader/LoadBox';
import { NavLink } from 'react-router-dom';
import SelectTextInput from '../../components/TextInput/SelectTextInput';
import { registerUser } from '../../api';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedUserDetails } from '../../redux/Slices/loginSlice';
import { validateEmail, validatePassword, validatePhoneNumber } from '../../utils/validateFunction';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DRAFT_KEY_C, DRAFT_KEY_L, DRAFT_KEY_P } from '../../env';

const RegisterPage = () => {
    const [loader, setLoader] = useState(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [registerss, setRegisters] = React.useState(true);
    const loginDetails = useSelector((state) => state.user.loggedUserDetails)
    const formFillCheck = useSelector((state) => state.user.registerFormDetails)
    const dispatch = useDispatch();

    // ================ Data submit form ==================
    const onSubmit = async (data) => {
        try {
            setLoader(true)
            await registerUser(data).then((res) => {
                console.log("⚡️🤯 ~ RegisterPage.jsx:40 ~ awaitregisterUser ~ res:", res)
                if (res?.message == "User created successfully") {
                    document.title = `Hamax : Talent Dashbaord | ${res?.user?.baseRole || ""}`
                    localStorage.removeItem('persist:root');
                    localStorage.removeItem(DRAFT_KEY_C);
                    localStorage.removeItem(DRAFT_KEY_L);
                    localStorage.removeItem(DRAFT_KEY_P);
                    setTimeout(() => {
                        dispatch(setLoggedUserDetails(res?.data || {}))
                        setLoader(false)
                        toast.success("Account created!");
                    }, 100);

                } else {
                    setLoader(false)
                    toast.error(res?.message || "Something went wrong")
                }
            }).catch((err) => {
                setLoader(false)
                toast.error(err?.message || "Something went wrong")
            })
        } catch (error) {
            setLoader(false)
            console.log(error?.message || "Something went wrong")
        }
    }


    useGSAP(() => {
        gsap.from(".card", {
            y: 30,
            opacity: 0,
            ease: "power1.inOut",
            duration: 1
        })
    }, [])


    return <>
        <div className="flex  h-screen w-full absolute bg-slate1 top-0 left-0 right-0 bottom-0 z-[9999] overflow-hidden justify-center items-center bg-[url(https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png)] backdrop-blur-xl transition-all duration-300 ease-in-out">
            <div className=' flex justify-center items-center space-x-10' >
                <div className="card w-[92%] lg:w-[85%] max-lg:w-[85%] flex flex-col justify-center bg-white p-5 md:px-10 md:py-20 rounded-2xl">
                    <form className="w-full space-y-4 md:space-y-6 lg:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <h2 className=" text-xl sm:text-2xl font-tbLex font-semibold tracking-tight text-primary flex items-center  space-x-1">
                                <span className='w-5 h-0.5 bg-primary z-10 rounded-full' /> <span>Hello there 👋🏻</span>
                            </h2>
                            <h2 className=" text-xl sm:text-2xl font-tbLex font-bold tracking-tight text-black ">
                                Create an account
                            </h2>
                            <h5 className=" text-xs md:text-sm font-tbPop font-normal text-slate-500">
                                We’re loading your personalized dashboard. Track progress, and explore features.
                            </h5>
                        </div>
                        <div className='space-y-6' >
                            <div className="">
                                <TextInput
                                    label="Enter Full Name*"
                                    placeholder="Enter Full Name"
                                    type="text"
                                    registerName="fullName"
                                    props={{ ...register('fullName', { required: "Full name is required", minLength: { value: 3, message: "Full name must be at least 3 characters" }, maxLength: { value: 50, message: "Full name cannot exceed 50 characters" } }), minLength: 3 }}
                                    errors={errors.fullName}
                                />
                            </div>
                            <div className="">
                                <TextInput
                                    label="Enter Your Email"
                                    placeholder="Enter Your Email"
                                    type="text"
                                    registerName="email"
                                    props={{ ...register('email'), valdate: validateEmail, required: "Email is required" }}
                                    errors={errors.email}
                                />
                            </div>
                            <div className="">
                                <TextInput
                                    label="Enter Your Password"
                                    placeholder="Enter Your Password"
                                    type="password"
                                    registerName="password"
                                    props={{ ...register('password', { validate: validatePassword, required: "Password is required" }), minLength: 6, }}
                                    errors={errors.password}
                                />
                            </div>
                            <div>
                                <TextInput
                                    label="Enter Your Phone Number"
                                    placeholder="Enter Your Phone Number"
                                    type="tel"
                                    registerName="phoneNumber"
                                    props={{ ...register('phoneNumber', { validate: validatePhoneNumber, required: true }), maxLength: 10, minLength: 10 }}
                                    errors={errors.phoneNumber}
                                />
                            </div>
                            <div className="">
                                <SelectTextInput
                                    label="Select Your Role"
                                    registerName="role"
                                    options={[
                                        { value: 'primary', label: 'Primary Actor' },
                                        { value: 'secondary', label: 'Secondary Actor' },
                                        { value: 'castingTeam', label: 'Casting Team' },
                                        { value: 'productionTeam', label: 'Production Team' },
                                    ]}
                                    props={{
                                        ...register('role', { required: true }),
                                        value: watch('role') || ''
                                    }}
                                    errors={errors.role}
                                />
                            </div>
                        </div>
                        <div className='space-y-2' >
                            {loader ? <LoadBox /> : <button
                                type="submit"
                                className={`${formBtn1} w-full h-[51px] !text-base bg-gradient-to-tl to-transparent from-transparent !bg-primary border border-transparent `}
                            >
                                Register
                            </button>}
                            <p className="text-slate-500 text-sm text-center font-tbPop tracking-tight font-normal">Already have an account? <NavLink className="text-primary hover:underline" to={"/login"}>Login</NavLink></p>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </>
}

export default RegisterPage
